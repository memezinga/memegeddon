const uuidv4 = require('uuid/v4'),
  { promisify } = require("util"),
  fs = require('fs');

exports.timestamp = () => new Date().getTime();
exports.saveFile = promisify(fs.writeFile);

exports.idGenerator = function (){
    return uuidv4(); 
};

exports.sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};


exports.isBetween = function (nbr, min, max) {
  return nbr >= min && nbr <= max;
};