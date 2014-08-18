var expect = require('expect.js'),
    path = require('path'),
    bl = require('bl'),
    regEscape = require('regexp-escape'),
    d = require('defunct'),
    apachelog = require('..'),
    Connection = require('ssh2');

describe('ssh-stream', function() {
  var auth = {
    host: 'marketsamurai.com',
    port: 22,
    username: 'root',
    privateKey: require('fs').readFileSync(path.join(process.env.HOME, '.ssh/id_rsa'))
  };

  xit('should be able to ls over ssh', function(done) {
    this.timeout(0);

    var conn = new Connection();
    conn.on('ready', function() {
      console.log('Connection :: ready');
      conn.shell(function(err, stream) {
        if (err) throw err;
        stream.on('close', function() {
          console.log('Stream :: close');
          done();
          conn.end();
        }).on('data', function(data) {
          console.log('STDOUT: ' + data);
        }).stderr.on('data', function(data) {
          console.log('STDERR: ' + data);
        });
        stream.end('ls -l /\nexit\n');
      });
    }).connect(auth);

  });

  xit('should be able to get a list of log files over sftp', function(done) {
    this.timeout(0);

    apachelog.listLogFiles(auth, function (err, list) {
      console.log(list.map(d.pluck('filename')));
      done();
    });
  });

  xit('should be able to stream a file over sftp', function(done) {
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
});
