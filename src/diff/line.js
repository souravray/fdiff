"use strict";

const LCS = require('./lcs'),
      crypto = require('crypto')

/**
 * @namespace diff
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

    let rLines = (!!isTokenized)? rData : this._tokenize(rData),
        lLines = (!!isTokenized)? lData : this._tokenize(lData)
    this.init(rLines, lLines)
  }

  /**
   *  @memberof Line
   *  @function _tokenize 
   *  @private 
   *  @param {string} data string blob
   *  @return {Array} lines array of sting
   */
  _tokenize(data) {
    const newLine = /^(\n|\r\n)$/
    let strData = data.toString()
    let lines = strData.split(/(\n|\r\n)/)
    return lines.filter( line => !newLine.test(line))
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