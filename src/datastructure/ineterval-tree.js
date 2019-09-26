"use strict";

class Node {
  constructor(start, end, value){
    this._start = start
    this._end = end
    this.value=value
    this.max = end
    this._parent = null;
    this._left = null;
    this._right = null;
  }

  inRange(value) {
    return value >= this._start && value <= this._end
  }

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

  reoffsetPosition(val) {
    return val - this._start
  }

  endPostion() {
    return this._end - this._start
  }
}

class Tree {
  constructor(sorted){
    this._isSrtd = sorted || false
    this._arr = new Array()
    this.root = null
  }

  add(start, end, value) {
    var n = new Node(start, end, value);
    this._arr.push(n)
    return true
  }

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

  _lazyInit() {
    if (this.root == null 
        && this._arr.length >0) {
      this._recInsert(this._sorted())
    }
  }

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

  search(value){
    this._lazyInit()
    return this._search(value, this.root)
  }
}

module.exports = Tree
