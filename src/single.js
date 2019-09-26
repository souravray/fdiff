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

  _wordDiff() {
    let words = new Word(this._diff.del[0], this._diff.add[0])
    words.computeMatrix()
    let wordDiffs = words.findDiff()
    let lineNo = Pt.nextTo(this._diff.coords.r.prev)
    let del = new Array()
    let add = new Array()
    
    wordDiffs.forEach( diff => {
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

  diff() {
    return this._wordDiff()
  }
}

module.exports = Single