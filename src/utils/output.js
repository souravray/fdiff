"use strict";

const chalk = require('chalk'),
      Pt = require('./pt')

const parseWDiff = (wdiff, fileName, isAdd) => {
  if(!wdiff.words || wdiff.words.length == 0) {
    return
  }
  let res = {}
  if (wdiff.coord.start == wdiff.coord.end) {
    res.header = (`${fileName} Line ${wdiff.line+1} Word ${wdiff.coord.start+1}`)
  } else {
    res.header = (`${fileName} Line ${wdiff.line+1} Words from ${wdiff.coord.start+1} to ${wdiff.coord.end}`)
  }
  
  let str = wdiff.words.join(" ")
  if(!isAdd) {
    res.body=[chalk.red('-  '+str)]
  } else {
    res.body=[chalk.green('+  '+str)]
  }
  return res
}

const parseMLHeader =(start, end) => {
  if (start == end) {
      return`At Line ${start+1} `
  } 
  return `From Line ${start+1} to ${end+1}} ` 
}

module.exports = {

  fmtSingle(diff, oldName, newName) {
    let res = {},
        header = ""
    if (diff.coords.r.prev == diff.coords.l.prev) {
      header = (`At Line ${Pt.nextTo(diff.coords.r.prev)+1} ${oldName}, ${newName}`)
    } else {
      header = (`At Line ${Pt.nextTo(diff.coords.r.prev)+1} ${oldName}, Line ${Pt.nextTo(diff.coords.l.prev)+1} ${newName}`)
    }
    res.header = header

    let dels =diff.del.map( d => parseWDiff(d, oldName, false)).filter( d => !!d)
    let adds =diff.add.map( d => parseWDiff(d, newName, true)).filter( d => !!d)
    res.body = [...dels, ...adds]
    if(res.body.length == 0) {
      return null
    }
    return res
  },
  
  fmtSegment(diff, oldName, newName) {
    let res = {},
      rlines = parseMLHeader(Pt.nextTo(diff.coords.r.prev), Pt.prevTo(diff.coords.r.prev)),
      llines = parseMLHeader(Pt.nextTo(diff.coords.l.prev), Pt.prevTo(diff.coords.l.prev))
    res.header = `${rlines} ${oldName}, ${llines} ${newName}`
    let dels =diff.del.map( d => parseWDiff(d, oldName, false)).filter( d => !!d)
    let adds =diff.add.map( d => parseWDiff(d, newName, true)).filter( d => !!d)
    res.body = [...dels, ...adds]
    if(res.body.length == 0) {
      return null
    }
    return res
  },

  fmtAdd(diff, oldName, newName) {
    let res = {},
        header = ''
    if (diff.coords.l.prev - diff.coords.l.next == 1) {
      header = `At Line ${Pt.nextTo(diff.coords.l.prev)+1} ${newName}`
    } else {
      header = `From Line ${Pt.nextTo(diff.coords.l.prev)+1} to ${Pt.prevTo(diff.coords.l.prev)+1} ${newName}`
    }
    res.header = header
    res.body=diff.add.map( l => chalk.green('+  '+l))
    return res
  },

  fmtDelete(diff, oldName, newName){
    let res = {},
      header = ''
    if (diff.coords.r.prev - diff.coords.r.next == 1) {
      header = `At Line ${Pt.nextTo(diff.coords.r.prev)+1} ${oldName}`
    } else {
      header = `From Line ${Pt.nextTo(diff.coords.r.prev)+1} to ${Pt.prevTo(diff.coords.l.prev)+1} ${oldName}`
    }
    res.header = header
    res.body=diff.del.map( l => chalk.red('-  '+l))
    return res
  }
}