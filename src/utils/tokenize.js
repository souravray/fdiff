"use strict";

/**
 *  @module utils/Tokenize
 */
module.exports = {
/**
 *  Tokenize strings as per word boundery
 *  @param {string} line string 
 *  @param {boolean} removeWhitespace 
 *  @return {Array} words array of sting
 */
  word: (line, removeWhitespace) => {
    const wordChar = /^[a-zA-Z\-_\(\)\\,\\.\\:\\;]+$/u,
          whiteChar = /^[\s\f\n\r\t\v\u00A0\u2028\u2029]*$/

    let tokens = line.split(/(\s+|[[\]{}'"]|\b)/)
    for (let i = 0; i < tokens.length - 1; i++) {
      // merege neighbouring non-space empty strings to the word
      // like `co-working`, `func_name`, `Anna's`
      if (!tokens[i + 1] 
          && tokens[i + 2]
          && wordChar.test(tokens[i])
          && wordChar.test(tokens[i + 2])) {
        tokens[i] += tokens[i + 2];
        tokens.splice(i + 1, 2);
        i--;
      }
    }

    if(!!removeWhitespace) {
      return tokens.filter(word => !whiteChar.test(word));
    }
    return tokens
  },

/** 
 *  Tokenize strings as per line breaks
 *  @param {string} line string 
 *  @param {boolean} removeWhitespace 
 *  @return {Array} words array of sting
 */
  line: (data, removeLinebreak) => {
    const newLine = /^(\n|\r\n)$/
    let strData = data.toString()
    let lines = strData.split(/(\n|\r\n)/)
    return lines.filter(line => !newLine.test(line))
  }
}