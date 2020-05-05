const fs = require("fs");

function parse(str) {
  return Function('"use strict";return (' + str + ')')();
}

/**
 * The database class
 * @class
*/
class Database {
  /**
   * @param {String} filePath
  */
  constructor(filePath) {
    this.filePath = filePath;

    if(!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, "{}");
    }

    let data = fs.readFileSync(this.filePath, "utf8");

    if((data === null) || (typeof data == "undefined") || (data == "")) {
      fs.writeFileSync(this.filePath, "{}");
    }
  }

  /**
   * This function sets a new data based on specified key in the database.
   * @param {String} key
   * @param {any} value
   * @returns {any}
  */
  set(key, value) {
    let obj = JSON.parse(fs.readFileSync(this.filePath, "utf8"));

    if(key.includes(".")) {
      let data = new String();

      for(let i = 0; i < key.split(".").length; i++) {
        if(i == 0) {
          data += ("obj");
        }

        data += (`["${key.split(".")[i]}"]`);

        if(typeof eval(data) == "undefined") {
          eval(`${data} = {}`);
        }
      }

      data += (" = ");
      data += (`parse('${JSON.stringify(value)}')`);

      eval(data);

      fs.writeFileSync(this.filePath, JSON.stringify(obj));
    } else {
      obj[key] = value;

      fs.writeFileSync(this.filePath, JSON.stringify(obj));
    }

    return this.get(key);
  }

  /**
   * This function gets a data by specified key in the database.
   * @param {String} key
   * @return {any}
  */
  get(key) {
    let obj = JSON.parse(fs.readFileSync(this.filePath, "utf8"));

    if(key.includes(".")) {
      let data = new String();

      for(let i = 0; i < key.split(".").length; i++) {
        if(i == 0) {
          data += ("obj");
        }

        data += (`["${key.split(".")[i]}"]`);

        if(typeof eval(data) == "undefined") {
          return undefined;
          break;
        }
      }

      return eval(data);
    } else {
      return JSON.parse(fs.readFileSync(this.filePath, "utf8"))[key];
    }
  }

  /**
   * This function deletes a data by specified key in the database.
   * @param {String} key
   * @return {any}
  */
  delete(key) {
    let obj = JSON.parse(fs.readFileSync(this.filePath, "utf8"));

    if(key.includes(".")) {
      let data = new String();

      for(let i = 0; i < key.split(".").length; i++) {
        if(i == 0) {
          data += ("obj");
        }

        if(i == (key.split(".").length - 1)) {
          eval(`delete ${data}["${key.split(".")[i]}"]`);
          fs.writeFileSync(this.filePath, JSON.stringify(obj));

          return true;
          break;
        } else {
          data += (`["${key.split(".")[i]}"]`);
        }

        if(typeof eval(data) == "undefined") {
          return false;
          break;
        }
      }
    } else {
      delete obj[key];
      fs.writeFileSync(this.filePath, JSON.stringify(obj));

      return true;
    }
  }

  /**
   * This function checks if the database has a data by specified key.
   * @param {String} has
   * @return {Boolean}
  */
  has(key) {
    return (typeof this.get(key) != "undefined");
  }

  /**
   * This function push value to a data by specified key.
   * @param {String} key
   * @param {any} value
   * @returns {any}
  */
  push(key, value) {
    let arr = ((this.has(key) && Array.isArray(this.get(key))) ? this.get(key) : new Array());
    arr.push(value);
    return this.set(key, arr);
  }

  /**
   * This function update a data by specified key.
   * @param {String} key
   * @param {Function} value
   * @return {any}
  */
  update(key, f) {
    let data = (this.has(key) ? this.get(key) : 0);
    this.set(key, f(data));
  }

  /**
   * This function update value from a data by specified key.
   * @param {String} key
   * @param {Number} index
   * @param {any} value
  */
  updateEl(key, index, value) {
    let data = (this.has(key) ? this.get(key) : false);
    let newData = new Array();

    if(!Array.isArray(data)) {
      return false;
    }

    for(let i = 0; i < data.length; i++) {
      if(i == index) {
        newData.push(value);
      } else {
        newData.push(data[i]);
      }
    }

    this.set(key, newData);

    return newData;
  }

  /**
   * This function delete a value by specified index from a data by specified key.
   * @param {String} key
   * @param {Number} index
   * @param {any} value
  */
  delElByIndex(key, index) {
    let data = (this.has(key) ? this.get(key) : false);
    let newData = new Array();

    if(!Array.isArray(data)) {
      return false;
    }

    for(let i = 0; i < data.length; i++) {
      if(i != index) {
        newData.push(data[i]);
      }
    }

    this.set(key, newData);

    return newData;
  }

  /**
   * This function delete specified value from a data by specified key.
   * @param {String} key
   * @param {any} filter
  */
  delElByVal(key, filter) {
    let data = (this.has(key) ? this.get(key) : false);
    let newData = new Array();

    if(!Array.isArray(data)) {
      return false;
    }

    for(let i = 0; i < data.length; i++) {
      if(data[i] != filter) {
        newData.push(data[i]);
      }
    }

    this.set(key, newData);

    return newData;
  }
}

module.exports = Database;
