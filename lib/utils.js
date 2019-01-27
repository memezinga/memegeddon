const uuidv4 = require('uuid/v4');

exports.idGenerator = function (){
    return uuidv4(); 
};

exports.sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};


exports.isBetween = function (nbr, min, max) {
  return nbr >= min && nbr <= max;
};