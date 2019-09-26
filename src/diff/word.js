"use strict";

const LCS = require('./lcs'),
    { Tokenize } = require('../utils')

/**
 * @class Word class implements
 * LCS class abstruct methods
 */
class Word extends LCS {
  /**
   * @param {string} rLine right hand string of words
   * @param {string} lLine left hand string of words
   */
  constructor(rLine, lLine, isTokenized,) {
    super();

    let rWords = (!!isTokenized)? rLine : Tokenize.word(rLine, true),
        lWords = (!!isTokenized)? lLine : Tokenize.word(lLine, true)
    this.init(rWords, lWords)
    this.i =0
  }

  /**
   *  @memberof Word
   *  @function _tokenize 
   *  @private 
   *  @param {string} line string 
   *  @return {Array} words array of sting
   */
  _tokenize(line) {
    const wordChar = /^[a-zA-Z\-_\(\)\\,\\.\\:\\;]+$/u,
          whiteChar = /^[\s\f\n\r\t\v\u00A0\u2028\u2029]*$/

    let tokens = line.split(/(\s+|[[\]{}'"]|\b)/)
    for (let i = 0; i < tokens.length - 1; i++) {
      // merege neighbouring non-space empty strings to the word
      // like `co-working1`, `func_name`, `field-name:`
      if (!tokens[i + 1] 
          && tokens[i + 2]
          && wordChar.test(tokens[i])
          && wordChar.test(tokens[i + 2])) {
        tokens[i] += tokens[i + 2];
        tokens.splice(i + 1, 2);
        i--;
      }
    }

    return tokens.filter( word => !whiteChar.test(word));
  }

  /**
   *  @memberof Word
   *  @function compare (Abstruct) method
   *  @param {string} rWord right word
   *  @param {string} lWord left word
   *  @return {bool} true if both sides are equal or else false
   */
  compare(rWord, lWord) {
    const whiteChar = /^[\s\f\n\r\t\v\u00A0\u2028\u2029]*$/
    if (rWord.length == lWord.length) {
      // don't compare white charecters directly
      if (whiteChar.test(rWord)
          && whiteChar.test(lWord)) {
        return true
      }
      return rWord === lWord
    }
    return false
  }
}

module.exports = Word