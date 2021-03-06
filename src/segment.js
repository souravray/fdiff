"use strict";

const { Word } = require('./diff'),
      { IntervalTree } = require('./datastructure'),
      { Fmt, Pt, Tokenize } = require('./utils')

/**
 * @class Segment 
 * A wrapper class for multiline diff segments.
 * Segment wrapper flaten outs a mutil line
 * segment in to single list of tokenized words,
 * and keep a look up reference of words to line in 
 * an interval tree. This is particulatly helpful 
 * for handling caces of line compaction/expansion
 */
class Segment {
  /*
  * @param {Object} diff takes a line diff object 
  */
  constructor(diff) {
    this._diff = diff
    this._rITree = new IntervalTree(true)
    this._lITree = new IntervalTree(true)
  }

  /**
   *  Flatten multi line words
   *  ceate a lookup interval tree
   *  to map words to original line
   *  boundaries  
   *  @memberof Segment
   *  @function _mergeLines
   *  @private
   *  @return {Array} array of two word arrays
   */
  _mergeLines() {
    const rLen = this._diff.del.length,
        lLen = this._diff.add.length,
        maxLen = (rLen > this.lLen)? rLen:lLen
    
    let rLineNo = Pt.nextTo(this._diff.coords.r.prev),
        lLineNo = Pt.nextTo(this._diff.coords.l.prev),
        rLine = [],
        lLine = []

    for (let i = 0; i < maxLen; i++) {
      if (rLen > i) {
        let rStart = rLine.length
        rLine = [...rLine, ...Tokenize.word(this._diff.del[i], true)]
        let rEnd = rLine.length - 1
        this._rITree.add(rStart, rEnd, rLineNo)
        rLineNo++
      }
      if (lLen > i) {
        let lStart = lLine.length
        lLine = [...lLine, ...Tokenize.word(this._diff.add[i], true)]
        let lEnd = lLine.length
        this._lITree.add(lStart, lEnd, lLineNo)
        lLineNo++
      }
    }
    return [rLine, lLine]
  }

/**
   *  Find word Diff for the entire segment
   *  @memberof Segment
   *  @function _wordDiff
   *  @private
   *  @return {object} segment diff object
   */
  _wordDiff() {
    let inputLines = this._mergeLines()
    // the words are already tokenised
    let words = new Word(inputLines[0], inputLines[1], true)
    words.computeMatrix()
    let wordDiffs = words.findDiff()
    
    return wordDiffs.map( diff => {
      let rStarLine =  this._rITree.search(Pt.nextTo(diff.coords.r.prev)),
        rDiff = this._formatDiff(rStarLine, diff.del, diff.coords.r),
        lStarLine = this._lITree.search(Pt.nextTo(diff.coords.l.prev)),
        lDiff =  this._formatDiff(lStarLine, diff.add, diff.coords.l)
      
      return {type: 'segment', coords:this._diff.coords, del: rDiff, add: lDiff}
    })
  }

  /**
   *  Find word Diff for the entire segment
   *  @memberof Segment
   *  @function _formatDiff
   *  @private
   *  @param {object} node object for current line
   *  @param {array} words array of diff words
   *  @return {object} co-ord  reference co-ordinate
   *  @return {object} diff phrase object
   */
  _formatDiff(startLine, words, coord) {
    if(!startLine) {
      return []
    }
    // reclibrate start position of the word
    // start position = previous position + 1
    let  coordStart = startLine.reoffsetPosition(Pt.nextTo(coord.prev)),
         lineNo = startLine.value

    // find if the last element of the word is range
    // last position = next position - 1
    if(startLine.inRange(Pt.prevTo(coord.next))) {
      // reclibrate last position of the word
      let coordEnd = startLine.reoffsetPosition(Pt.prevTo(coord.next))
      return [Fmt.segPhrase(lineNo,coordStart,coordEnd,words)]
    } else {
      let res = [],
          // if word set ends in next line find the end of the
          // subset, by setting the subset end position to the
          // end of the line 
          coordEnd = startLine.endPostion(),
          // words length from the first word to
          // the last word in the range. 
          wordsLength = Pt.fromTo(coordStart, coordEnd)

      if (wordsLength > 0) {
              // take the current subset of words, that in range
          let currentWords = words.slice(0,wordsLength),
             // find other half of the words which will be iteratd
             // to be found in next line(s)
              nxtWords = words.slice(wordsLength),
              prevToNewLine = wordsLength + coord.prev,
              nxtCoord = { prev:prevToNewLine, next: coord.next},

          res = [Fmt.segPhrase(lineNo,coordStart,coordEnd,currentWords)]

          let nxtLine = this._rITree.search(Pt.nextTo(prevToNewLine))
          let nxtRes = this._formatDiff(nxtLine, nxtWords, nxtCoord)
        return [...res, ...nxtRes]
      }
    }
  }

  /**
   *  Public diff() method
   *  @memberof Segment
   *  @function diff
   *  @return {object} diff segment object
   */
  diff() {
    if (this._diff.del.length == 0) {
      return {type: 'addition', coords:this._diff.coords, add: this._diff.add}
    }
    if (this._diff.add.length == 0) {
      return {type: 'deletion', coords:this._diff.coords, del: this._diff.del}
    }
    return this._wordDiff()
  }
}

module.exports = Segment