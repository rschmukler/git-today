require('colors');

var cp = require('child_process');


function Report(author, dir, duration) {
  this.author = author;
  this.dir = dir;
  this.duration = duration || 24;
}

module.exports = Report;

Report.prototype.run = function(done) {
  var self = this;

  var cmd = 'git log --since ' + this.duration.toString() + '.hours --oneline --shortstat -C --author="'+ this.author + '"';

  cp.exec(cmd, {cwd: this.dir}, function(err, stdout, stderr) {
    if(err) {
      if(done) return done(err);
      else return;
    }

    var lines = stdout.split("\n"),
        results = {
          files: 0,
          insertions: 0,
          deletions: 0,
        };

    lines.forEach(parseLine);

    results.net = results.insertions - results.deletions;

    self.results = results;

    if(done) return done(null, results);

    function parseLine(line) {
      var match = line.match(/(\d*) file(s?) changed, (\d*) insertion(s?)\(\+\), (\d*) deletion(s?)\(\-\)/);
      if(match) {
        results.files += parseInt(match[1], 10);
        results.insertions += parseInt(match[3], 10);
        results.deletions += parseInt(match[5], 10);
      }
    }
  });
};

Report.prototype.print = function(err) {
  if(err) throw err;
  if(!this.results) return this.run(this.print.bind(this));

  var results = this.results;

  var color = results.net > 0 ? 'green' : 'red';

  console.log("Git stats for last %s in %s:".white, durationString(this.duration), this.dir);
  console.log("  " + results.files.toString().yellow + " files modified");
  console.log("  " + results.insertions.toString().green + " line insertions");
  console.log("  " + results.deletions.toString().red + " line deletions");
  console.log(" =======================");
  console.log("  " + results.net.toString()[color] + " net lines");

};

function durationString(duration) {
  var result;
  if(duration < (1/600)) { result = (duration * 3600).toString() + ' seconds'; }
  else if(duration < 1) { result = (duration * 60).toString() + ' minutes'; }
  else if(duration < 24) { result = duration.toString() + ' hours'; }
  else result = (duration / 24).toString() + ' days';

  if(duration == 1/60 || duration == 1 || duration == 24) result = result.slice(0, -1);

  return result;
}
