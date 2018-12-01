var express = require('express');
var router = express.Router();
const fs = require('fs');

// Check is Array
const isArray = (data) => {
  if (data !== null && (data instanceof Array || data instanceof Function))
    return true
  return false
}

const isExist = (key) => {
  let filepath = '';

  if (key) {
    filepath = `./cache/${key}`;

    if (fs.existsSync(filepath)) {
      return true;
    } else {
      return false;
    }
  } else {
    throw console.error('Please provide the key.');
  }
}

const get = (key) => {

  const exist = isExist(key);

  if (exist) {

    const filepath = process.cwd() + `/cache/${key}`;

    const data = fs.readFileSync(filepath, 'utf8');

    let promise = new Promise((resolve, reject) => {

      resolve(data);

      reject(new Error('Something wrong!'));
    });

    return promise;
  } else {
    return null;
  }
}

const multiGet = (keys) => {

  let arrs = [];

  if (isArray(keys)) {

    keys.map(key => {

      const exist = isExist(key);

      if (exist) {

        const filepath = `./cache/${key}`;

        const data = fs.readFileSync(filepath, 'utf8');

        new Promise((resolve, reject) => {

          arrs.push(Object.assign({ key: key, value: resolve(data) }));

          reject(new Error('Something wrong!'));
        });

      } else {
        arrs.push(Object.assign({ key: key, value: null }));
      }
    })

    return arrs;

  } else {
    throw console.error('Please provide list of array keys');
  }
}

const set = (key, content) => {

  const dirpath = process.cwd() + `/cache`;

  if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath, 0777);
  }

  fs.writeFile(`${dirpath}/${key}`, content, (err) => {
    if (err) throw err;
    return console.log("The file was succesfully saved!");
  });
}

const multiSet = (items) => {
  if (isArray(items)) {
    items.map(item => {

      const dirpath = process.cwd() + `/cache`;

      if (!fs.existsSync(dirpath)) {
        fs.mkdirSync(dirpath, 0777);
      }

      fs.writeFile(`${dirpath}/${item.key}`, item.value, (err) => {
        if (err) throw err;
        return console.log("The file was succesfully saved!");
      });
    })
  } else {
    throw console.error('Please provide list of array items');
  }
}

const remove = (key) => {

  const filepath = process.cwd() + `/cache/` + key;

  fs.unlink(filepath, (err) => {
    if (err) return console.log(err);

    return console.log('File deleted successfully.');
  });
}

const removeAll = () => {

  const filepath = process.cwd() + `/cache`;

  fs.readdir(filepath, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(`${filepath}/${file}`, err => {
        if (err) throw err;
      });
    }
  });
}
