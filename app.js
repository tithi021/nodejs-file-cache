const fs = require('fs');
const path = require('path');

const randomString = (len) => {
  const charSet = 'abcdefghijklmnopqrstuvwxyz_';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

exports.generateFilename = (arg) => {
  if (arg) {
    const objVal = Object.values(arg);
    let _key = '';
    if (objVal.length > 0) {
      objVal.map((value, key) => {
        objVal.length - 1 == key ? _key = _key + value : _key = value + '-' + _key;
      })
      return _key;
    }
  } else {
    const randomStr = randomString(25);
    return randomStr;
  }
}

exports.isFileExist = (dir, filename) => {
  let filepath = '';
  if (dir && filename) {
    filepath = `./${dir}/${filename}`;
    if (fs.existsSync(filepath)) {
      return {
        filepath: filepath,
        succss: true
      }
    } else {
      return {
        filepath: filepath,
        succss: false
      }
    }
  } else {
    throw console.error('Please provide both directory and filename.')
  }
}

exports.createCache = (dir, filename, content) => {
  const dirpath = path.join(__dirname, `../../${dir}`);

  if(!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath, 0777);
  }
  
  fs.writeFile(`${dirpath}/${filename}`, content, (err) => {
    if (err) throw err;
    return console.log("The file was succesfully saved!");
  });
}

exports.getCache = (filepath) => {
  const data = fs.readFileSync(filepath, 'utf8');
  let promise = new Promise(function(resolve, reject) {
    resolve(data);
    reject(new Error('Filepath not found'));
  });
  return promise;
}