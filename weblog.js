var through2 = require('through2');

module.exports = weblog;
function weblog() {
  var s = through2.obj(write);
  var line = '';
  function write(data, enc, cb) {
    var self = this;
    line += data.toString();
    if (line.indexOf('\n') !== -1) {
      var parts = line.split('\n');
      var tail = parts.pop();
      var head = parts;
      head.forEach(function (line) {
        self.push(parseLine(line));
      });
      line = tail;
    };
    cb();
  }
  return s;
}

function parseLine(line) {
  var parts = [];
	var lookingFor = ' ';
	var part = '';

	var i = 0;

  for (var j = 0; j < line.length; j++) {
    var c = line[j];
		if (c == lookingFor) {
      parts.push(part);
			part = '';
			lookingFor = ' ';
    } else if (part == '') {
			switch (c) {
        case '[':
					lookingFor = ']';
          break;

        case '"':
					lookingFor = '"';
          break;

        default:
					part += c;
          break;
      }
    } else {
			part += c;
    }
  }

  if (part) {
    parts.push(part);
  }

  return parts;
}

