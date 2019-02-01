const archiver = require('archiver'),
  rimraf = require('rimraf'),
  uuidv4 = require('uuid/v4'),
  { promisify } = require("util"),
  fs = require('fs');

exports.timestamp = () => new Date().getTime();

exports.saveFile = promisify(fs.writeFile);

exports.listFiles = promisify(fs.readdir);

exports.getFile = promisify(fs.readFile);

exports.removeFolder = promisify(rimraf);

/**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 * @see https://stackoverflow.com/a/51518100
 */
exports.zipDirectory = (source, out) => {
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
};

exports.idGenerator = function (){
    return uuidv4(); 
};

exports.sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};


exports.isBetween = function (nbr, min, max) {
  return nbr >= min && nbr <= max;
};