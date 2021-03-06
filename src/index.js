"use strict";

const { Line, Word } = require('./diff'),
    File = require('./file'),
    Segment = require('./segment'),
    Single = require('./single'),
    { Out } = require('./utils')

/** 
 *  convert read streams into line diff
 *  @function getLineDiff
 *  @private
 *  @param {Array} dset Array of file read output\
 *  @return {promise} return a promise of line Diff objects
 */
const getLineDiff = (dset) => {
  return new Promise((rslv, rjct) => {
    if(dset.length != 2) {
      rjct(new Error("Not enought data"))
      return
    }
    let ldiff = new Line(dset[0], dset[1])
    ldiff.computeMatrix()
    rslv(ldiff.findDiff())
  })
}

/** 
 *  take the result of line diff and split it for multiple 
 *  segment leve word diff
 *  @function sortDiffs
 *  @private
 *  @param {Array} lnDiff result array of aline wise diff
 *  @return {Promise} promise all for segment diff
 */
const prepareSegments = (lnDiff) => {
  let segments = lnDiff.map( sDiff => {
    return new Promise( (rslv, rjct) => {
      if(sDiff.del.length == 1
        && sDiff.add.length == 1) {
        let sng = new Single(sDiff),
          res = sng.diff()
          rslv(res)
          return
      }
      let seg = new Segment(sDiff),
          res = seg.diff()
      rslv(res)
    })
  })
  return Promise.all(segments)
}

/** 
 *  @function sortDiffs
 *  @private
 *  @param {Array} results array of diff objects
 *  @return {Array} return a sorted Diff object Array
 */
const sortDiffs = (results) => {
  return results.flat(1)
    .sort((p,n) => {
        if (p.coords.r.start > n.coords.r.start) {
          return 1;
        } 
        if (p.coords.r.start < n.coords.r.start) {
          return -1;
        }
        if (p.coords.l.start > n.coords.l.start) {
          return 1;
        } 
        if (p.coords.l.start < n.coords.l.start) {
          return -1;
        }
        return 0;
    })
}


/**
 *  @module main
 */
module.exports = {
/** 
 *  read files and return pomise for a sorted diff objects
 *  @param {string} rFile older file path
 *  @param {string} lFile newer file path
 *  @return {promise} return a promise of sorted Diff objects
 */
  diffP: (rFile, lFile) => {
  let files = new File(rFile, lFile)
  return files.readAll()
    .then(getLineDiff)
    .then(prepareSegments)
    .then(sortDiffs)
  },

/** 
 *  format a diff object into message JSOM
 *  @param {object} a high level diff object
 *  @param {string} oldfile older file name
 *  @param {string} newFile newer file name
 *  @return {promise} returns a msg JSON
 */
  formatP: (diff, oldfile, newFile) => {
    return diff.map( d => {
      let res = null
      switch(d.type) {
        case "segment":
          res = Out.fmtSegment(d, oldfile, newFile)
          break
        case "addition":
          res = Out.fmtAdd(d, oldfile, newFile)
          break
        case "deletion":
          res = Out.fmtDelete(d, oldfile, newFile)
          break
        case "single":
          res = Out.fmtSingle(d, oldfile, newFile)
          break
        default:
      }
      if(!!res) {
        return res
      }
    })
  }
}

