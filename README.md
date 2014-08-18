# apachelog

Stream, process and parse apache logs with node.js

## Installation

This module is installed via npm:

``` bash
$ npm install apachelog
```

## Example Usage

``` js
var apachelog = require('apachelog');

var auth = {
  host: 'marketsamurai.com',
  port: 22,
  username: 'root',
  privateKey: require('fs').readFileSync(path.join(process.env.HOME, '.ssh/id_rsa'))
};

it('should be able to get a list of log files over sftp', function(done) {
  this.timeout(0);

  apachelog.listLogFiles(auth, function (err, list) {
    console.log(list.map(d.pluck('filename')));
    done();
  });
});

it('should be able to stream a file over sftp', function(done) {
  this.timeout(0);
  apachelog.createReadStream(auth, 'access.log', { start: 0, end: 300 },
    function (err, s) {
      if (err) return done(err);
      s.on('data', console.log);
      s.on('end', done);
    });
});

it('should be able to stream a gzipped file over sftp', function(done) {
  this.timeout(0);
  apachelog.createReadStream(auth, 'access.log.3.gz', { start: 0, end: undefined },
    function (err, s) {
      if (err) return done(err);
      s.on('data', console.log);
      s.on('end', done);
    });
});
```
