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


    var code = $('#body div#pageContent').scrape(frame, {
        string: true
    });
    return code;
}

async function submissionCode(submissionId, contestId) {
    var url = 'https://codeforces.com/contest/' + contestId + '/submission/' + submissionId;
    var result = await scrapsite(url);
    result = JSON.parse(result);
    result = result.code;
    result = result.replace(/#/g, "\n#");
    result = result.replace(/#include<iostream>/g, "#include<iostream>\n");
    result = result.replace(/{/g, "{\n");
    result = result.replace(/}/g, "}\n");
    result = result.replace(/; /g, ";\n");
    console.log(result);
}


function contestStatistics(handle) {
    // TODO:
    request(' http://codeforces.com/api/user.rating?handle=' + handle, function (error, response, body) {
        if (error) {
            console.error(error);
        } else {
            var result = JSON.parse(body);
            if(result.status == "FAILED") {
                console.log(result.comment);
            } else {
                var change = {rateChange: [], increase: 0, decrease: 0, zero: 0};
                result = result.result;
                
                for(i = 0; i < result.length; i++){
                    oldRate = result[i].oldRating;
                    newRate = result[i].newRating;
                    change.rateChange.push(newRate - oldRate);
                    if(oldRate < newRate) {
                        ++change.increase;
                    } else if(oldRate > newRate) {
                        ++change.decrease;
                    }
                }    
                change.zero = result.length - (change.increase + change.decrease);        
                index = {
                    min: Math.min(...change.rateChange),
                    max: Math.max(...change.rateChange),
                    i: 0,
                    j: 0,
                    flagI: 0,
                    flagJ: 0
                };

                for(i = 0; i < change.rateChange.length; i++) {
                    if(index.max == change.rateChange[i] && change.rateChange[i] > 0) {
                        index.i = i;
                        index.flagI = 1;
                    }
                    if(index.min == change.rateChange[i] && change.rateChange[i] < 0) {
                        index.j = i;
                        index.flagJ = 1
                    }
                }
                rating = {
                        highOld: result[index.i].oldRating,
                        highNew: result[index.i].newRating, 
                        lowOld: result[index.j].oldRating, 
                        lowNew: result[index.j].newRating
                };

                console.log("[-] No of Contests: " + result.length);
                console.log("[-] Rate increase in contests: " + change.increase);
                console.log("[-] Rate decrease in contests: " + change.decrease);
                console.log("[-] zero Rate Change: " + change.zero);
                if(index.flagI) {
                    console.log(colors.green("[-] Highest increase: " + rating.highOld + " -> " + rating.highNew + ": +" + change.rateChange[index.i]));
                } else {
                    console.log(colors.green("[-] Highest increase: Never Increased!"));
                }
                if(index.flagJ) {
                    console.log(colors.red("[-] Highest decrease: " + rating.lowOld + " -> " + rating.lowNew + ": " + change.rateChange[index.j]));
                } else {
                    console.log(colors.red("[-] Highest decrease: Never Decreased!"));
                }

            }
        }
    })
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
                for (i = 0; i < result.length; ++i) {
                    if (result[i].verdict == "OK") {
                        var accepted_Question = result[i].problem.contestId + result[i].problem.index;
                        accepted.push(accepted_Question);
                        if (accepted.includes(accepted_Question) == false) {
                            accepted.push(accepted_Question);
                        }
                    }
                }
                request('https://codeforces.com/api/problemset.problems?tags=' + tag, function (error, response, body) {
                    var accepted_Result = [];
                    if (error) {
                        console.error(error);
                    } else {
                        var result = JSON.parse(body);
                        if (result.status == "FAILED") {
                            console.log(result.comment);
                        } else {
                            var found = 0;
                            var result = result.result;
                            for (var i = 0; i < result.problems.length; ++i) {
                                var current_Question = result.problems[i].contestId + result.problems[i].index
                                if (result.problems[i].rating <= difficulty && accepted.includes(current_Question) == false) {
                                    accepted_Result.push({
                                        Name: result.problems[i].name,
                                        Rating: result.problems[i].rating,
                                        URL: "https://codeforces.com/problemset/problem/" + result.problems[i].contestId + "/" + result.problems[i].index

                                    })
                                }
                            }

                            for (var j = 0; j < accepted_Result.length; ++j) {
                                accepted_Result = shuffle(accepted_Result);
                                const {
                                    Name,
                                    Rating,
                                    URL
                                } = accepted_Result[0];
                                console.log("[-] Name : " + Name);
                                console.log("[-] Rating : " + Rating)
                                console.log("[-] URl : " + colors.green(URL));
                                console.log("----------------------\n");
                                found += 1;
                                accepted_Result = accepted_Result.slice(1);
                                if (found == count)
                                    break;
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
                var author, title, url;
                var found = [];
                for (var i = 0; i < 100; i++) {
                    // Printing The number of recent activities the user wanted
                    if (found.length < count) {
                        author = result[i].blogEntry.authorHandle;
                        title = result[i].blogEntry.title.slice(3, -4);
                        url = "https://codeforces.com/blog/entry/" + result[i].blogEntry.id;

                        if (found.includes(title) == false) {
                            console.log('[-] Author : ' + author);
                            console.log('[-] Title : ' + title);
                            console.log('[-] URL : ' + colors.green(url));
                            console.log("----------------------\n");
                            found.push(title); // keeping track of what have been printed to avoid repeatition.
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
            result = result.result.slice(0, count + 1);
            for (i = 0; i < count; ++i) {
                console.log('[-] Submission Link :' + colors.green('https://codeforces.com/contest/' + result[i].contestId + '/submission/' + result[i].id));
                console.log('[-] Problem Name :' + result[i].problem.name);
                console.log('[-] Problem Id :' + result[i].contestId + result[i].problem.index);
                if (result[i].verdict != "OK") {
                    console.log('[-] Problem Status :' + result[i].verdict + " on test " + (result[i].passedTestCount + 1));
                } else {
                    console.log('[-] Problem Status :' + result[i].verdict);
                }
                console.log("----------");
            }
        }
    });
}


function upcomingContests(count) {
    request('https://codeforces.com/api/contest.list', function (error, response, body) {
        if (error) {
            console.error(error);
        } else {
            var result = JSON.parse(body);
            if (result.status == "FAILED") {
                console.log(result.comment);
            } else {
                result = result.result.slice(1, count + 1);
                for (i = 0; i < result.length; ++i) {
                    if (result[i].phase != "FINISHED" && count > 0) {
                        count -= 1;
                        console.log('[-] Contest Name :' + result[i].name);
                        console.log('[-] Contest Duration :' + result[i].durationSeconds / 3600 + " hours");
                        console.log('[-] Contest Type :' + result[i].type);
                        console.log('[-] Contest Status :' + result[i].phase);
                        console.log("----------");
                    }
                }
            }
        }
    });
}

function tagsDistribution (handle){
    var accepted_Tags = [];
    var tagsDictionary = {
        'implementation' : numimp = 0,
        'dp' : numdp = 0,
        'math' : nummath = 0,
        'greedy' : numgreedy = 0,
        'brute force' : numbrute = 0,
        'data structures' : numdata = 0,
        'constructive algorithms' : numcons = 0,
        'dfs' : numdfs = 0,
        'sortings' : numsort = 0,
        'binary search' : numsearch = 0,
        'graphs' : numgraphs = 0,
        'trees' : numtree = 0,
        'strings' : numstring = 0,
        'number theory' : numtheory = 0,
        'geometry' : geometry = 0,
        'combinatorics' : numcombinatorics = 0,
        'two pointers' : numpointers = 0,
        'dsu' : numdsu = 0,
        'bitmasks' : bitmasks = 0,
        'probabilities' : numprobabilities = 0,
        'shortest paths' : numshort = 0,
        'hashing' : numhashing = 0,
        'divide and conquer' : numdivide = 0,
        'games' : numgames = 0,
        'matrices' : nummatrices = 0,
        'flows' : numflows = 0,
        'string suffix structures' : numsuffix = 0,
        'expression parsing' : numexpression = 0,
        'graph matchings' : nummatchings = 0,
        'ternary search' : numternary = 0,
        'meet-in-the-middle' : nummeet = 0,
        'fft' : numfft = 0,
        '2-sat' : numsat = 0,
        'chinese remainder theorem' : numchinese = 0,
        'schedules' : numschedules = 0, 
    };
     
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
                        var tags= result[i].problem.tags;
                        accepted_Tags.push(tags);
                    }
                }
                for (i = 0; i < accepted_Tags.length; ++ i)
                {
                    for ( j = 0; j < accepted_Tags[i].length; ++j)
                    {
                        for (var key in tagsDictionary)
                        {
                            if (key == accepted_Tags[i][j]){
                                ++ tagsDictionary[key];
                            }
                        }
                    }
                }
                for (i in tagsDictionary){
                    if (tagsDictionary[i] != 0)
                        console.log(i + " " + tagsDictionary[i]);
                }
                
            }
        }
    });
}



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
            getUser(usr);
        else
            console.log("Invalid!!!!!!");
    });

program
    .command('sub-code')
    .option('-s, --submission', 'submission id required')
    .option('-i, --contest', 'contest id required')
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
program
    .command('tags-distribution')
    .option('-u, --user', 'handle of the required user')
    .action(function (usr) {
        if (typeof usr === "string")
            tagsDistribution(usr);
        else
            console.log("Invalid!!!!!!");
    });

program.parse(process.argv);