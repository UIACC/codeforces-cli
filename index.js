#!/usr/bin/env node

const request = require('request');
const program = require('commander');
const colors = require('colors');
const shuffle = require('shuffle-array');
const cheerio = require('cheerio')
const jsonframe = require('jsonframe-cheerio')
const got = require('got');


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

async function scrapsite(url) {
    const html = await got(url) // Loading URL
    const $ = cheerio.load(html.body) //Getting html data
    jsonframe($) // initializing the plugin

    var frame = {
    	code: {
    		_s: ".roundbox",
    		_d: "#program-source-text"
    	}
    };


    var code = $('#body div#pageContent').scrape(frame, {string: true});
    return code;
  }

async function submissionCode(submissionId,contestId) {
    var url = 'https://codeforces.com/contest/' +contestId +'/submission/' +submissionId;
    var result = await scrapsite(url);
    result = JSON.parse(result);
    result = result.code;
    result = result.replace(/;/g, ";\n");
    console.log(result);
}


function contestStatistics(handle) {
    // TODO:
    console.log(colors.green("coming Soon :)"));
}


async function generateProblems(handle, count, tag, difficulty) {
    var accepted = [];
    await request('https://codeforces.com/api/user.status?handle=' + handle, function (error, response, body) {
        if (error) {
            console.error(error);
        } else {
            var result = JSON.parse(body);
            if (result.status == "FAILED") {
                console.log(result.comment);
            } else {
                result = result.result;
                for (i = 0; i < 100; ++i) {
                    if (result[i].verdict == "OK") {
                        var accepted_Question = result[i].problem.contestId + result[i].problem.index;
                        accepted.push(accepted_Question);
                    }
                }
                request('https://codeforces.com/api/problemset.problems?tags=' + tag, function (error, response, body) {
                    if (error) {
                        console.error(error);
                    } else {
                        var result = JSON.parse(body);
                        if (result.status == "FAILED") {
                            console.log(result.comment);
                        } else {
                            var found = 0;
                            var result = result.result;
                            while (found < count) {
                                result.problems = shuffle(result.problems);
                                var current_Question = result.problems[0].contestId + result.problems[0].index
                                if (result.problems[0].rating <= difficulty && accepted.indexOf(current_Question) == -1) {
                                    console.log("[-] Name : " + result.problems[0].name);
                                    console.log("[-] Rating : " +result.problems[0].rating )
                                    console.log("[-] URl : " + colors.green("https://codeforces.com/problemset/problem/" + result.problems[0].contestId + "/" + result.problems[0].index));
                                    console.log("----------------------\n");
                                    found += 1;
                                    result.problems = result.problems.slice(1);

                                }
                            }
                        }
                    }
                });
            }
        }
    });
}




function recentActions(count) {
    // Requesting the recent action data from the API
    request('http://codeforces.com/api/recentActions?maxCount=100', function (error, response, body) {
        if (error) {
            // catching errors in connection
            console.error(error);
        } else {
            var result = JSON.parse(body);
            if (result.status == "FAILED") {
                // Catching error in request format
                console.log(result.comment);
            } else {
              // Parsing the result
              result = result.result;
              var author,title,url;
              var found = [];
              for (var i = 0; i < 100; i++) {
                // Printing The number of recent activities the user wanted
                if (found.length<count) {
                  author = result[i].blogEntry.authorHandle;
                  title = result[i].blogEntry.title.slice(3,-4);
                  url = "https://codeforces.com/blog/entry/"+result[i].blogEntry.id;

                  if (found.includes(title)==false) {
                    console.log('[-] Author : ' + author);
                    console.log('[-] Title : ' + title);
                    console.log('[-] URL : ' + colors.green(url));
                    console.log("----------------------\n");
                    found.push(title);      // keeping track of what have been printed to avoid repeatition.
                  }
                }
              }
            }
        }
    });
}


function userSubmissions(handle, count) {
    request('https://codeforces.com/api/user.status?handle=' + handle + "&from=1&count=" + count + 1, function (error, response, body) {
        if (error) {
            console.error(error);
        } else {
          var result = JSON.parse(body);
          result = result.result.slice(0,count+1);
          for(i=0;i<count;++i){
            console.log('[-] Submission Link :' + colors.green('https://codeforces.com/contest/' + result[i].contestId +'/submission/' + result[i].id));
            console.log('[-] Problem Name :' + result[i].problem.name);
            console.log('[-] Problem Id :' + result[i].contestId + result[i].problem.index);
            if(result[i].verdict != "OK") {
              console.log('[-] Problem Status :' +  result[i].verdict + " on test " + (result[i].passedTestCount + 1));
            }
            else {
            console.log('[-] Problem Status :' +  result[i].verdict);
            }
            console.log("----------");
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
            for( i = 0 ; i < result.length ; ++i){
              if(result[i].phase != "FINISHED" && count>0){
                count-=1;
                console.log('[-] Contest Name :' + result[i].name);
                console.log('[-] Contest Duration :' + result[i].durationSeconds/3600 + " hours");
                console.log('[-] Contest Type :' +  result[i].type);
                console.log('[-] Contest Status :' + result[i].phase);
                console.log("----------");
              }
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
    .option('-c, --contest', 'contest id required')
    .action(function (sub_id, con_id) {
        if (typeof sub_id === "string" && typeof con_id === "string")
            submissionCode(sub_id, con_id);
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
