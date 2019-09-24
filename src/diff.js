"use strict";

/**
 * @class Diff base class that implements
 * a LCS algotrithm
 */
 class Diff {
  /**
   * @function constructor method
   * @param {string} pref string prefix for the location description 
   * @throws  error if called outside a child class
   */
  constructor(pref) {
    if (new.target === Diff) {
      throw new Error('Cannot construct direct instance Diff class');
    }
    this._pref = pref || '';
    this._rSet = [];
    this._lSet = [];
    this._matrix = [];
    this._matchlen = 0
    this._start = -1
    this._rEnd = 0
    this._lEnd = 0
  }

  /**
   *  @function init method
   *  @param {Array} rSet right set of comparable data
   *  @param {Array} lSet left set of comparable data
   */
  init(rSet, lSet) {
    this._rSet = rSet
    this._lSet = lSet
    this._rEnd = rSet.length
    this._lEnd = lSet.length
    this._matrix = new Array(rSet.length)                 
  }

  /**
   *  @function compare (Abstruct) method
   *  @param {object} elR right element
   *  @param {object} elL left element
   *  @return {bool} true if elR==elL or else false
   *  @throws  error if not implemented by child class
   */
  compare(elR, elL) {
    throw Error('compare method should be defined in the implementation calss');
  }

  /**
   *  computs an edit graph to find
   *  longest common subsiquent between Right Set and Left Set.
   *  @function computeMatrix method 
   *  @return {number} length of the LCS
   */
  computeMatrix() {
    const d = this
    d._rSet.forEach( (elR, i) => {
      // boolean flag to stop copmaring once a match
      // is foiund for the row
      let matchFound = false
      d._matrix[i] = new Array(d._lSet.length).fill(0)
      d._lSet.forEach( (elL, j) => {
        if (!matchFound && !!d.compare(elR, elL)) {
          let left = (j==0)? 0 : d._matrix[i][j-1]
          d._matrix[i][j] = 1 + left
          d._matchlen = d._matrix[i][j]
          matchFound = true
        } else {
          let top = (i==0)? 0:d._matrix[i-1][j],
              left = (j==0)? 0:d._matrix[i][j-1]
          d._matrix[i][j] = Math.max(top, left)
        }
      })
    })
    return this._matchlen;
  }

   /**
   *  travers through the LCS graph and compute the diff
   *  @function findDiff method
   *  @return {Array} Array of diffs
   */
  findDiff() {
    // Return entrie Right hand set as deleted
    // and Left hand set a added if there is zero match
    if (this._matchlen == 0) {
      let diffs = [this._diff(this._start, this._rEnd, this._start, this._lEnd)]
      console.log(JSON.stringify(diffs, null, 2));
      return diffs
    } 

    let diffs = new Array(),
        previ = this._rEnd, // refernce co-ordinate from where 
        prevj = this._lEnd  // the matching started
    for(let m=0; m < this._matchlen; m++) {
      let i = previ - 1,
          j = prevj - 1,
          matched = false
      // find a match
      do {
        let cval = this._matrix[i][j],
            lval = (j==0)? 0 : this._matrix[i][j-1],
            tval = (i==0)? 0 : this._matrix[i-1][j]
        if (cval>lval && cval>tval) {
          // create a patch if there is diffrencess
          // between two sucessive matched nodes
          if((previ-i) > 1 || (prevj-j) > 1 ) {
            diffs.unshift(this._diff(i, previ, j, prevj))
          }
          matched = true // circuit breake 
          previ=i // update the ref-coordiantes
          prevj=j
        } else if(cval>lval) {
          i -= 1
        } else {
          j -= 1
        }
      } while(!matched && (i>-1 && j>-1) )
    }

    // check if the is diff at the begining 
    if(previ>0 || prevj>0) {
      diffs.unshift(this._diff(this._start, previ, this._start, prevj))
    }
    return diffs
  }

  /**
   *
   *  @function _diff 
   *  @private 
   *  @param {number} rStart starting coordinate i
   *  @param {number} rEnd starting coordinate j
   *  @param {number} lStart end coordinate i
   *  @param {number} lEnd end coordinate j
   *  @return {Object} Diff object
   */
  _diff(rStart, rEnd, lStart, lEnd) {
    let key = this._pref + ' btween '
              + (rStart+1) + " to "
              + (rEnd+1)
    let deleted = this._rSet.slice(rStart+1, rEnd)
    let added = this._lSet.slice(lStart+1, lEnd)
    return { key: key,del:deleted, add: added}
  }
}

module.exports = Diff