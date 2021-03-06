var path = require('path'),
    expect = require('expect.js'),
    bl = require('bl'),
    fs = require('fs'),
    weblog = require('../weblog');

describe('parse web log files', function() {
  function fixture(file) {
    return path.join(__dirname, 'fixtures', file);
  }

  it('should be able to parse a web log file', function(done) {
    var logFile = fixture('simple.log');
    var results = [];
    fs.createReadStream(logFile)
      .pipe(weblog())
      .on('data', function (data) {
        results.push(data);
      })
      .on('end', function () {
        expect(results.length).to.equal(4);
        expect(results).to.eql(
          [ [ '46.4.22.22',
              '-',
              '-',
              '17/Aug/2014:06:44:20 +1000',
              '',
              'GET /c/nischentool HTTP/1.1',
              '',
              '302',
              '770',
              '-',
              '',
              'Java/1.6.0_43' ],
            [ '208.115.111.66',
              '-',
              '-',
              '17/Aug/2014:06:44:20 +1000',
              '',
              'GET /blog/el/accounts-system/ HTTP/1.1',
              '',
              '503',
              '2178',
              '-',
              '',
              'Mozilla/5.0 (compatible; DotBot/1.1; http://www.opensiteexplorer.org/dotbot, help@moz.com)' ],
            [ '46.4.22.22',
              '-',
              '-',
              '17/Aug/2014:06:44:21 +1000',
              '',
              'GET /cookiemonster.php?partner=nischentool&redirect_to=http://www.marketsamurai.com&utm_campaign=marketsamurai_affiliates&utm_source=nischentool&utm_medium=affiliate&utm_content=marketsamurai.com:default HTTP/1.1',
              '',
              '301',
              '830',
              '-',
              '',
              'Java/1.6.0_43' ],
            [ '46.4.22.22',
              '-',
              '-',
              '17/Aug/2014:06:44:21 +1000',
              '',
              'GET /cookiemonster.php?partner=nischentool&redirect_to=http%3A%2F%2Fwww.marketsamurai.com&utm_campaign=marketsamurai_affiliates&utm_source=nischentool&utm_medium=affiliate&utm_content=marketsamurai.com%3Adefault HTTP/1.1',
              '',
              '301',
              '869',
              '-',
              '',
              'Java/1.6.0_43' ] ]);
        done();
      });
  });
});
