"use strict";

/**
 *  @module utils/Fmt
 */
module.exports = {
/**
 *  Create a formated Diff object
 *  @param {number} rPrev previous element - right co-ordinates
 *  @param {number} rPrev next element  - right co-ordinates
 *  @param {number} lPrev previous element - left co-ordinates
 *  @param {number} lPrev next element  - left co-ordinates
 *  @param {Array}  rList Right list
 *  @param {Array}  lList left list
 *  @return {Obj} simple Diff object
 */
  diffObj: (rPrev, rNext, lPrev, lNext, rList, lList) => {
    return { coords: {
            r: {prev:rPrev, next:rNext},
            l: {prev:lPrev, next:lNext}
          },
          del: rList,
          add: lList
        }
  },

/**
 *  Create a formated Diff object
 *  @param {string} type either segment-line/segment-word
 *  @param {Object} coord segment co-ordinates  
 *  @param {Array}  rList Right list
 *  @param {Array}  lList left list
 *  @return {Obj} segmented Diff object
 */
  segObj: (type, coord, rList, lList) => {
    return { coords: {
            r: {prev:rRev, next:rNext},
            l: {prev:lPrev, next:lNext}
          },
          del: rList,
          add: lList
        }
  },

/**
 *  Create a formated diff Phrase object
 *  @param {number} line  number
 *  @param {number} start  first word of the phrase
 *  @param {number} end    last word  word of the phrase
 *  @param {Array}  words  list of words
 *  @return {Obj} diff phase object
 */
  segPhrase: (lineNo, start, end, words) => {
    return {
          line: lineNo, 
          coord: {
            start: start,
            end: end
          },
          words: words
        }
  }
}