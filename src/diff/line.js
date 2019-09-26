"use strict";

const LCS = require('./lcs'),
    { Tokenize } = require('../utils'),
    crypto = require('crypto')

/**
 * @class Line class implements
 * LCS class abstruct methods
 */
class Line extends LCS {
  /**
   * @param {Buffer} rData right hand blob of lines
   * @param {Buffer} lData left hand blob of lines
   */
  constructor(rData, lData, isTokenized) {
    super();

    let rLines = (!!isTokenized)? rData : Tokenize.line(rData, true),
        lLines = (!!isTokenized)? lData : Tokenize.line(lData, true)
    this.init(rLines, lLines)
  }

  /**
   *  @memberof Line
   *  @function compare (Abstruct) method
   *  @param {string} rLine right line
   *  @param {string} lLine left line
   *  @return {bool} true if both sides are equal or else false
   */
  compare(rLine, lLine) {
    if (rLine.length == lLine.length) {
      return crypto.timingSafeEqual(Buffer.from(rLine),Buffer.from(lLine))
    }
    return false
  }
}

module.exports = Line