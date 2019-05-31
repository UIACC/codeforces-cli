#!/usr/bin/env node

// Main Packages needed for the application
const program = require('commander');
const functions = require('./functions')

program
    .version('1.0.4', '-v, --version');

program.on('--help', () => {
    console.log('\n  All options:');
    console.log('    -u, --user                handle of the required user');
    console.log('    -c, --count               number of results required');
    console.log('    -t, --tag                 tag of the required problems');
    console.log('    -d, --difficulty          difficulty of the required problems');
    console.log('    -s, --submission          Submission ID of the requiered submission');
    console.log('    -i, --contest             contest ID of the requiered submission');
});


program
  .command('get-user')
  .option('-u, --user', 'handle of the required user')
  .action(function (usr) {
      if (typeof usr === "string")
          functions.getUserInfo(usr);
      else
          console.log("Invalid!!!!!!");
  });

program
  .command('get-code')
  .option('-s, --submission', 'submission id required')
  .option('-i, --contest', 'contest id required')
  .action(function (sub_id, con_id) {
      if (typeof sub_id === "string" && typeof con_id === "string")
          functions.getSubmissionCode(sub_id, con_id);
      else
          console.log("Invalid!!!!!!");
  });


program
  .command('get-stats')
  .option('-u, --user', 'handle of the required user')
  .action(function (usr) {
      if (typeof usr === "string")
          functions.getContestStatistics(usr);
      else
          console.log("Invalid!!!!!!");
  });

program
  .command('get-submissions')
  .option('-u, --user', 'handle of the required user')
  .option('-c, --count', 'number of problems to be generated')
  .action(function (usr, cnt) {
    if (typeof usr === "string" && typeof cnt === "string")
    functions.getUserSubmissions(usr, cnt);
    else
    console.log("Invalid!!!!!!");
  });

program
  .command('get-contests')
  .option('-c, --count', 'max number of upcoming contest to print')
  .action(function (cnt) {
      if (typeof cnt === "string")
          functions.getUpcomingContests(cnt);
      else
          console.log("Invalid!!!!!!");
  });

program
  .command('get-blogs')
  .option('-c, --count', 'number of blogs to get')
  .action(function (cnt) {
      if (typeof cnt === "string")
          functions.getRecentActions(cnt);
      else
          console.log("Invalid!!!!!!");
  });




program
  .command('get-problems')
  .option('-u, --user', 'handle of the required user')
  .option('-c, --count', 'number of problems to be generated')
  .option('-t, --tag', 'category of the problem to be generated')
  .option('-d, --difficulty', 'difficulty of the required problems')
  .action(function (usr, cnt, tag, dif) {
      if (typeof usr === "string" && typeof cnt === "string" &&
          typeof tag === "string" && typeof dif === "string")
          functions.getProblems(usr, cnt, tag, dif);
      else
          console.log("Invalid!!!!!!");
  });



program
  .command('tag-distribution')
  .option('-u, --user', 'handle of the required user')
  .action(function (usr) {
      if (typeof usr === "string")
          functions.tagsDistribution(usr);
      else
          console.log("Invalid!!!!!!");
  });

program.parse(process.argv);
