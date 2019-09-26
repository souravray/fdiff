const program = require('commander'),
       chalk = require('chalk'),
 { diffP, formatP } =  require('./src')

program
  .version('0.0.1')
  .option('-o, --old <old>', 'Old file', '')
  .option('-n, --new <new>', 'New file', '')
  .parse(process.argv);

  const indentation =["","  ","    ","      ", "        ", "          "]
  const print = (level, obj) => {
    if(typeof obj === 'string') {
      console.log(indentation[level],obj);
      return
    }

    if(typeof obj === 'object') {
      level++
      if(Array.isArray(obj)) {
        obj.forEach( o => print(level,o))
      }
      if(obj.header) {
        console.log(chalk.gray(indentation[level],obj.header));
      }
      if(obj.body) {
        return print(level,obj.body)
      }
    }
    return
  }

 diffP(program.old, program.new)
  .then( sr => {
    return formatP(sr, program.old, program.new)  
  })
  .then( sr => {
    sr.forEach( s => {
      print(0, s)
      console.log('\n');
    })
  })
  // .catch( err => {
  //   console.error("Error: ",err.message)
  // })
