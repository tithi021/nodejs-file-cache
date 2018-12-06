const fs = require('fs');
const path = require('path');

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

          arrs.push(Object.assign({
            key: key,
            value: resolve(data)
          }));

          reject(new Error('Something wrong!'));

        });

      } else {
        arrs.push(Object.assign({
          key: key,
          value: null
        }));
      }
    })

    return arrs;

  } else {

    throw console.error('Please provide list of array keys');

  }
}

Date.prototype.getWeek = function() {
  var dt = new Date(this.getFullYear(),0,1);
  return Math.ceil((((this - dt) / 86400000) + dt.getDay()+1)/7);
};

const timeRemaining = (num, unit) => {

  const current = new Date();

  let expireDate;

  // const oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

  // var firstDate = new Date(2008,01,12);
  // var secondDate = new Date(2008,01,22);

  // var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));


  if (unit == 'year') {

    expireDate = current.setFullYear(current.getFullYear() + num);

    console.log(expireDate)

  } else if (unit == 'month') {

    expireDate = current.setMonth(current.getMonth() + num);

    console.log(expireDate)

  } else if (unit == 'week') {

    const thisWeek = current.getWeek();

    current.setDate(current.getDate() + eval(7 * num));

    return eval(current.getMonth() + 1) + "/" + current.getDate() + "/" + current.getFullYear();

  } else if (unit == 'day') {

  } else if (unit == 'minute') {

  }
}

const setFileDuration = (duration, unit) => {

  const date_provided = new Date().setMinutes(new Date().getMinutes() + 1);
  console.log(date_provided)

  const time_remaining = (date_provided) => new Date(date_provided) - new Date();
  console.log(time_remaining)

  let timeOuts = []; // We create an array of timeouts in case we want to cancel one later
  const timer = setTimeout(() => remove(key), time_remaining(date_provided));
  timeOuts.push(timer);

}

const set = (key, content, duration) => {
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