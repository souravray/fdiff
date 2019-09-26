"use strict";

const fs = require('fs'),
      { Line, Word } = require('./diff'),
      Segment = require('./segment')

/**
 * @class Files 
 * A simple wrapper class for expanding single line diffs
 */
class Files {
  /*
  * @param {string} rFilePath - file path for old version of the text
  * @param {string} lFilePath - file path for new version of the text
  */
  constructor(rFilePath, lFilePath) {
    this._FilePaths = [rFilePath, lFilePath]
  }

  /*
  * 
  * Wrapper over fs.readFile
  * returns a Promis
  */
  _read(path, order) {
    return new Promise((rslv, rjct) => {
      fs.readFile(path, (err, data) => {
        if (!!err) {
          rjct(err)
          return
        };
        rslv({o:order, d:data});
      })
    })
  }

/**
   *  read both the file concurrently
   *  @memberof Files
   *  @function readAll
   *  @return {Promise} promise.All for file(S) read
   */
  readAll() {
    const f = this 
    let readers = this._FilePaths
          .map((path, i) => f._read(path, i))
    return Promise.all(readers)
      .then(rs => rs.sort((r1,r2) => r1.o-r2.o).map(r => r.d))
  }
}

module.exports = Files 