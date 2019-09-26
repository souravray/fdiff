"use strict";

/**
 *  helper methods for ambiguous 
 *  point calculations
 *  @module utils/Pt
 */
module.exports = {
/** move index forward by 1
 *  @param {number} pt index value 
 *  @param {number} next index value
 */
  nextTo(pt) {
    return pt + 1
  },

/** move index backward by 1
 *  @param {number} pt index value 
 *  @param {number} previous index value
 */
  prevTo(pt) {
    return pt - 1
  },

/** find the lenght of elements 
 *  between two index (with zero index correction)
 *  @param {number} prev initial boundary index
 *  @param {number} next terminal boundary index
 *  @param {number} number of elements
 */
  between(prev, next) {
    let start = prev + 1
    return next - start
  },

/** find the lenght of elements from an intial el
 *  index, to the last index (with zero index correction)
 *  @param {number} prev initial index
 *  @param {number} next terminal index
 *  @param {number} number of elements
 */
  fromTo(start, end) {
    let next = end + 1
    return next - start
  }

}