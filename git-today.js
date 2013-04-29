var cp = require('child_process'),
    fs = require('fs'),
    path = require('path');

require('colors');

var dirPath = path.resolve(process.argv[2]);
    gitPath = dirPath + '/.git';


var authorName = "Ryan Schmukler";

function checkValidProject() {
  if(fs.existsSync(dirPath)) {
    if(!fs.existsSync(gitPath)) {
      console.error("No git repo at specified directory");
      process.exit(1);
    }
  } else {
    console.error("Invalid path specified");
    process.exit(1);
  }
}

function throwError(err) {
  console.error("Fatal error: " + err);
  process.exit(1);
}

function parseCommits(cb) {
  //var cmd = 'git log --since 24.hours --pretty=format:"%h" --author="'+ authorName + '"';
  var cmd = 'git log --since 24.hours --oneline --shortstat -C --author="'+ authorName + '"';

  cp.exec(cmd, {cwd: dirPath}, function(err, stdout, stderr) {
    if(err)
      throwError(err);

    var lines = stdout.split("\n");

    var results = [0, 0, 0];

    for(var x = 0; x < lines.length; ++x) {
      var line = lines[x],
          match = line.match(/(\d*) files changed, (\d*) insertions\(\+\), (\d*) deletions\(\-\)/);

      if(match) {
        results[0] += parseInt(match[1], 10);
        results[1] += parseInt(match[2], 10);
        results[2] += parseInt(match[3], 10);
      }
    }

    cb(results);
  });
}

function printResults(stats) {
  var net = stats[1] - stats[2],
      color = '';

  if(net > 0)
    color = 'green';
  else
    color = 'red';

  console.log("Git stats: ".white);
  console.log("  " + stats[0].toString().yellow + " files modified");
  console.log("  " + stats[1].toString().green + " line additions");
  console.log("  " + stats[2].toString().red + " line deleitions");
  console.log("=====================");
  console.log("    " + net.toString()[color] + " net lines");
}

checkValidProject();
parseCommits(printResults);
