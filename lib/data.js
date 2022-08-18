const fs = require("fs");
const path = require("path");

const lib = {};

lib.basedir = path.join(__dirname, "/../.data/");

// create data from file
lib.create = function (dir, file, data, callback) {
  fs.open(`${lib.basedir + dir}/${file}.json`, "wx", (err, fileDiscriptor) => {
    if (!err && fileDiscriptor) {
      const stringData = JSON.stringify(data);
      fs.writeFile(fileDiscriptor, stringData, (err2) => {
        if (!err2) {
          fs.close(fileDiscriptor, (err3) => {
            if (!err3) {
              callback(false);
            } else {
              callback(err3);
            }
          });
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
};

lib.update = function (dir, file, data, callback) {
  fs.open(`${lib.basedir + dir}/${file}.json`, "r+", (err, fileDiscriptor) => {
    if (!err && fileDiscriptor) {
      // convert to data to string
      const stringData = JSON.stringify(data);
      // file khali kora hocce

      fs.ftruncate(fileDiscriptor, (err1) => {
        if (!err1) {
          // write to the file and close it
          fs.writeFile(fileDiscriptor, stringData, (err2) => {
            if (!err2) {
              fs.close(fileDiscriptor, (err3) => {
                if (!err3) {
                  callback(false);
                } else {
                  callback("Error Closing File");
                }
              });
            } else {
              callback("error writing file");
            }
          });
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
};

lib.delete = function (dir, file, callback) {
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Error Delete");
    }
  });
};

// red data from file

lib.read = function (dir, file, callback) {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf8", (error, data) => {
    callback(error, data);
  });
};

lib.list = (dir, callback) => {
  fs.readdir(`${lib.basedir + dir}/`, (err, fileName) => {
    if (!err && fileName && fileName.length > 0) {
      let trimsFileName = [];
      fileName.forEach((item) => {
        trimsFileName.push(item.replace(".json", ""));
      });
      callback(false, trimsFileName);
    } else {
      callback("error reading dirctory");
    }
  });
};
module.exports = lib;
