var expect = require('expect.js'),
    regEscape = require('regexp-escape'),
    Connection = require('ssh2'),
    zlib = require('zlib'),
    weblog = require('./weblog');

module.exports.listLogFiles = listLogFiles;
function listLogFiles(auth, cb) {
  var conn = new Connection();
  conn.on('ready', function() {
    conn.sftp(function(err, sftp) {
      if (err) return cb(err);
      sftp.readdir('/var/log/apache2', function (err, list) {
        if (err) return done(err);
        var logs = list
          .filter(function (item) {
            return getFileIndex(item.filename) >= 0;
          })
          .sort(fileIndexCompare());

        cb(null, logs);
      });
    });
  }).connect(auth);
}

module.exports.createReadStream = createReadStream;
function createReadStream(auth, filename, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  var conn = new Connection();
  conn.on('ready', function() {
    conn.sftp(function(err, sftp) {
      if (err) return cb(err);
      var s = sftp.createReadStream('/var/log/apache2/' + filename, opts);
      if (/\.gz$/.test(filename)) {
        s = s.pipe(zlib.createGunzip());
      }
      s = s.pipe(weblog());
      cb(null, s);
    });
  }).connect(auth);
}

function getFileIndex(prefix, fileName) {
  if (typeof fileName === 'undefined') {
    fileName = prefix;
    prefix = 'access.log';
  }
  if (prefix === fileName) return 0;

  prefix = RegExp.escape(prefix);

  if (!fileName) return 0;

  var m = new RegExp('^' + prefix + '\\.([0-9]+)(\\.gz$)?').exec(fileName);
  if (m) {
    return parseInt(m[1]);
  }

  return -1;
}

function fileIndexCompare(dir) {
  if (typeof dir === 'undefined') dir = true;
  var mul = 1;
  if (!dir) mul = -1;
  return function (a, b) {
    var aNum = getFileIndex(a.filename);
    var bNum = getFileIndex(b.filename);
    if (aNum < bNum) return mul*-1;
    if (aNum > bNum) return mul*1;
    return 0;
  };
}
