#!/usr/bin/env node

const request = require('request');
const program = require('commander');
const colors = require('colors');


function getUser(handle) {
    request('http://codeforces.com/api/user.info?handles=' + handle, function (error, response, body) {
        if (error) {
            console.error(error);
        } else {
            var result = JSON.parse(body);
            if (result.status == "FAILED") {
                console.log(result.comment);
            } else {
                result = result.result[0];
                console.log('[-] Handle: ' + result.handle);
                console.log('[-] Name: ' + result.firstName + ' ' + result.lastName);
                console.log('[-] Rank: ' + result.rank);
                console.log('[-] Best Rank: ' + result.maxRank);
                console.log('[-] Rate: ' + result.rating);
                console.log('[-] Best Rate: ' + result.maxRating);
                console.log('[-] Country: ' + result.country);
                console.log('[-] Organization: ' + result.organization);
                console.log('[-] Number of friends: ' + result.friendOfCount);
                console.log('[-] Number of Contributions: ' + result.contribution);
            }
        }
    });
}


function submissionCode(submissionId) {
    // TODO:
    console.log(colors.green("coming Soon :)"));
}


function contestStatistics(handle) {
    // TODO:
    console.log(colors.green("coming Soon :)"));
}


async function generateProblems(handle, count, tag, difficulty) {
    var accepted = [];
    request('https://codeforces.com/api/user.status?handle=' + handle, function (error, response, body) {
        if (error) {
            console.error(error);
        } else {
            var result = JSON.parse(body);
            if (result.status == "FAILED") {
                console.log(result.comment);
            } else {
                result = result.result;
                for (i = 0; i < result.length; ++i) {
                    if (result[i].verdict == "OK") {
                        var accepted_Question = result[i].problem.contestId + result[i].problem.index;
                        accepted.push(result[i].accepted_Question);
                    }

                }

            }
        }
    });
    request('https://codeforces.com/api/problemset.problems?' + tag, function (error, response, body) {
        if (error) {
            console.error(error);
        } else {
            var result = JSON.parse(body);
            if (result.status == "FAILED") {
                console.log(result.comment);
            } else {
                var found = 0;
                var i = 0;
                var result = result.result;
                while (found < count) {
                    var current_Question = result.problems[i].contestId + result.problems[i].index
                    if (result.problems[i].rating <= difficulty && accepted.indexOf(current_Question) == -1) {
                        console.log(" [-] " + result.problems[i].name + " " + result.problems[i].rating);
                        console.log(" [-] URl : "+ colors.green("https://codeforces.com/problemset/problem/" + result.problems[i].contestId + "/" + result.problems[i].index));
                        console.log("----------------------\n");
                        found += 1;
                    }
                    i += 1;
                }
            }
        }
    });

}




function recentActions(count) {
    // TODO:
    request('http://codeforces.com/api/recentActions?maxCount=30', function (error, response, body) {
        if (error) {
            console.error(error);
        } else {
            var result = JSON.parse(body);
            if (result.status == "FAILED") {
                console.log(result.comment);
            } else {
              result = result.result.slice(1, count+1);
              var author,title,url;
              for (var i = 0; i < count; i++) {
                author = result[i].blogEntry.authorHandle;
                title = result[i].blogEntry.title.slice(3,-4);
                url = "https://codeforces.com/blog/entry/"+result[i].blogEntry.id;
                console.log("\n----------------------");
                console.log('[-] Author: ' + author);
                console.log('[-] Title : ' + title);
                console.log(colors.green('[-] URL : ' + url));
                console.log("----------------------");
              }
            }
        }
    });
}


function userSubmissions(handle, count) {
  request('https://codeforces.com/api/user.status?handle=' + handle + "&from=1&count=" + count+1, function (error, response, body){
    if (error){
      console.error(error);
    } else {
        var result = JSON.parse(body);
        if (result.status == "FAILED"){
          console.log(result.comment);
        } else {
          result = result.result.slice(1,count+2);
          for(i=0;i<count;++i){
            console.log('[-] Problem Name :' + result[i].problem.name);
            console.log('[-] Problem Id :' + result[i].contestId + result[i].problem.index);
            console.log('[-] Problem Status :' +  result[i].verdict);
            console.log("----------");
          }
        }
      }
    });
}


function upcomingContests(count) {
    request('https://codeforces.com/api/contest.list', function (error, response, body){
      if (error){
        console.error(error);
      } else {
          var result = JSON.parse(body);
          if (result.status == "FAILED"){
            console.log(result.comment);
          } else {
            result = result.result.slice(1,count+1);
            for(i=0;i<count;++i){
              console.log('[-] Contest Name :' + result[i].name);
              console.log('[-] Contest Duration :' + result[i].durationSeconds/3600 + " hours");
              console.log('[-] Contest Type :' +  result[i].type);
              console.log('[-] Contest Status :' + result[i].phase);
              console.log("----------");
            }
          }
        }
      });
}



program
    .version('0.0.1', '-v, --version');

program.on('--help', () => {
    console.log('  All options:');
    console.log('    -u, --user                handle of the required user');
});


program
    .command('get-user')
    .option('-u, --user', 'handle of the required user')
    .action(function (usr) {
        if (typeof usr === "string")
            getUser(usr);
        else
            console.log("Invalid!!!!!!");
    });

program
    .command('sub-code')
    .option('-s, --submission', 'submission id required')
    .action(function (id) {
        if (typeof id === "string")
            submissionCode(id);
        else
            console.log("Invalid!!!!!!");
    });


program
    .command('con-stat')
    .option('-u, --user', 'handle of the required user')
    .action(function (usr) {
        if (typeof usr === "string")
            contestStatistics(usr);
        else
            console.log("Invalid!!!!!!");
    });


program
    .command('gen-problems')
    .option('-u, --user', 'handle of the required user')
    .option('-c, --count', 'number of problems to be generated')
    .option('-t, --tag', 'category of the problem to be generated')
    .option('-d, --difficulty', 'difficulty of the required problems')
    .action(function (usr, cnt, tag, dif) {
        if (typeof usr === "string" && typeof cnt === "string" &&
            typeof tag === "string" && typeof dif === "string")
            generateProblems(usr, cnt, tag, dif);
        else
            console.log("Invalid!!!!!!");
    });


program
    .command('rec-action')
    .option('-c, --count', 'number of blogs to get')
    .action(function (cnt) {
        if (typeof cnt === "string")
            recentActions(cnt);
        else
            console.log("Invalid!!!!!!");
    });


program
    .command('com-contest')
    .option('-c, --count', 'max number of upcoming contest to print')
    .action(function (cnt) {
        if (typeof cnt === "string")
            upcomingContests(cnt);
        else
            console.log("Invalid!!!!!!");
    });


program
    .command('usr-submission')
    .option('-u, --user', 'handle of the required user')
    .option('-c, --count', 'number of problems to be generated')
    .action(function (usr, cnt) {
        if (typeof usr === "string" && typeof cnt === "string")
            userSubmissions(usr, cnt);
        else
            console.log("Invalid!!!!!!");
    });

program.parse(process.argv);
