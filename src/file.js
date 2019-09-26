"use strict";

const fs = require('fs'),
      { Line, Word } = require('./diff'),
      Segment = require('./segment')


class Files {
  constructor(rFilePath, lFilePath) {
    this._FilePaths = [rFilePath, lFilePath]
  }

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

  readAll() {
    const f = this 
    let readers = this._FilePaths
          .map((path, i) => f._read(path, i))
    return Promise.all(readers)
      .then(rs => rs.sort((r1,r2) => r1.o-r2.o).map(r => r.d))
  }
}

module.exports = Files 