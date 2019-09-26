"use strict";

/**
 * Interval Tree Node
 * @class Node
 */
class Node {
  /**
   * @param {number} start interval
   * @param {number} end interval
   * @param {number} numerical value
   */
  constructor(start, end, value){
    this._start = start
    this._end = end
    this.value=value
    this.max = end
    this._parent = null;
    this._left = null;
    this._right = null;
  }

  /**
   *  Find if an index is in range
   *  @memberof Node
   *  @function inRange
   *  @param {nuber} index value
   *  @return {boolean} in-range or out-of-range
   */
  inRange(value) {
    return value >= this._start && value <= this._end
  }

  /**
   *  @memberof Node
   *  @function next
   *  @param {nuber} index value
   *  @return {object} return next node
   */
  next(value) {
    if (this._left != null
        &&value <= this._left.max) {
      return this._left
    }
    if (this._right != null
        &&value<=this._right.max) {
      return this._right
    }
    return null
  }

  /**
   *  update the index relative 
   *  to range offset
   *  @memberof Node
   *  @function reoffsetPosition
   *  @param {nuber} index value
   *  @return {number} offsetted index
   */
  reoffsetPosition(val) {
    return val - this._start
  }

  /**
   *  @memberof Node
   *  @function endPostion
   *  @return {number} offsetted max-range index
   */
  endPostion() {
    return this._end - this._start
  }
}

/**
 * Interval Tree Node
 * @class Tree
 */
class Tree {
  /**
   * @param {bool} sorted is stored array sorted
   */
  constructor(sorted){
    this._isSrtd = sorted || false
    this._arr = new Array()
    this.root = null
  }

  /**
   *  Add new interval. This method is only allowed
   *  until the tree is initialized
   *  @memberof Tree
   *  @function add
   *  @param {nuber} start interval
   *  @param {nuber} end interval
   *  @param {nuber} value
   *  @return {boolean} success; false if the tree is 
   *  already initialized
   */
  add(start, end, value) {
    var n = new Node(start, end, value);
    this._arr.push(n)
    return true
  }


  /**
   *  inser a node to tree
   *  @memberof Tree
   *  @function _insert
   *  @private
   *  @param {object} node Node object
   */
  _insert(node) {
    if (this.root == null) {
      this.root = node
      return
    }
    let parent = this.root
    do {
      if (node.max > parent.max) {
        parent.max = node.max
      }
      if (node._start > parent._start ){
        if (parent._right == null) {
          parent._right = node
          node._parent = parent
        } else {
          parent = parent._right
        }
      } else {
        if (parent._left == null) {
          parent._left = node
          node._parent = parent
        } else {
          parent = parent._left
        }
      }
    } while(node._parent == null)
  }

/**
 *  sort input array (if required)
 *  @memberof Tree
 *  @function _sorted
 *  @private
 *  @return {Array} sorted Node array
 */
  _sorted() {
    if (!this._isSrtd) {
      return this._arr.sort((n1,n2) => {
        if (n1.start > n2.start) {
          return 1;
        } 
        if (n1.start < n2.start) {
          return -1;
        }
        return 0;
      })
    }
    return this._arr
  }

/**
 *  Lazy tree initialization
 *  @memberof Tree
 *  @function _lazyInit
 *  @private
 */
  _lazyInit() {
    if (this.root == null 
        && this._arr.length >0) {
      this._recInsert(this._sorted())
    }
  }

/**
 *  Recursive Insersion from sorted array
 *  complexity O(n)
 *  @memberof Tree
 *  @function _recInsert
 *  @private
 */
  _recInsert(arr) {
    let mindx = Math.floor(arr.length/2),
        node = arr[mindx],
        larr = arr.slice(0, mindx),
        rarr = arr.slice(mindx+1)
    this._insert(node)
    if(larr.length>0) {
      this._recInsert(larr)
    }
    if(rarr.length>0) {
      this._recInsert(rarr)
    }
  }

/**
 *  Inplimentation method of search
 *  @memberof Tree
 *  @function _search
 *  @private
 *  @param {number} value index value
 *  @param {object} node root node
 *  @return {object} matching node
 */
  _search(value, node) {
    if (this.root == null ) {
      return
    }
    if(node.inRange(value)) {
      return node
    }
    let nxtNode = node.next(value)
    if (nxtNode == null) {
      return null
    }
    return this._search(value, nxtNode)
  }

/**
 *  A point search API
 *  @memberof Tree
 *  @function search
 *  @param {number} value index value
 *  @return {object} matching node
 */
  search(value){
    this._lazyInit()
    return this._search(value, this.root)
  }
}

module.exports = Tree
