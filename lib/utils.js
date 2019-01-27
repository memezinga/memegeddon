exports.sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};


exports.isBetween = function (nbr, min, max) {
  return nbr >= min && nbr <= max;
};