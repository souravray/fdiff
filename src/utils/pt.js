"use strict";

/**
 *  @module utils/Pt
 *  helper methods for ambiguous 
 *  point calculations
 */
module.exports = {
  nextTo(pt) {
    return pt + 1
  },

  prevTo(pt) {
    return pt - 1
  },

  between(prev, next) {
    let start = prev + 1
    return next - start
  },

  fromTo(start, end) {
    let next = end + 1
    return next - start
  }

}