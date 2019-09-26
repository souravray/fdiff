"use strict";

const { Word } = require('./diff'),
      { IntervalTree } = require('./datastructure'),
      { Fmt, Pt, Out } = require('./utils')

/**
 * @class Single 
 * A simple wrapper class for expanding single line diffs
 */
class Single {
  /*
  * @param {Object} diff takes a line diff object 
  */
  constructor(diff) {
    this._diff = diff
  }

/**
   *  Find word Diff for the line
   *  @memberof Single
   *  @function _wordDiff
   *  @private
   *  @return {object} segment diff object
   */
  _wordDiff() {
    let words = new Word(this._diff.del[0], this._diff.add[0])
    words.computeMatrix()
    let wordDiffs = words.findDiff()
    let lineNo = Pt.nextTo(this._diff.coords.r.prev)
    let del = new Array()
    let add = new Array()
    
    wordDiffs.forEach( diff => {
      // stack all diff results in two buckets
      del.push(Fmt.segPhrase(lineNo,
                      Pt.nextTo(this._diff.coords.r.prev),
                      Pt.prevTo(this._diff.coords.r.next),
                      diff.del
                    ))
      add.push(Fmt.segPhrase(lineNo,
                      Pt.nextTo(this._diff.coords.l.prev),
                      Pt.prevTo(this._diff.coords.l.next),
                      diff.add
                    ))     
    })
    return {type: 'single', coords:this._diff.coords, del: del, add: add}
  }

  /**
   *  Public diff() method
   *  @memberof Single
   *  @function diff
   *  @return {object} diff line object
   */ 
  diff() {
    return this._wordDiff()
  }
}

module.exports = Single