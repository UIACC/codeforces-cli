// Packages Needed for the main functionality
const fs = require('fs');
const colors = require('colors');
const request = require('request');
const shuffle = require('shuffle-array');
const helpers = require('./helpers');

// Setting specific themes used in printing
const correct = colors.green.bold;
const wrong = colors.red.bold;
const name = colors.cyan.bold;
const lineBreak = colors.rainbow;
const link = colors.green.bold.underline;
const title = colors.magenta.bold;


// GET User information
exports.getUserInfo = function(handle) {
  // Construct the query url
  var queryUrl = 'http://codeforces.com/api/user.info?handles=' + handle;
  request(queryUrl, function (error, response, body) {
    // Did we face an error with the request
    if (error)
      console.error(error);
    else {
      // Parse the Result
      var queryResult = JSON.parse(body);
      // Check The result Status
      if (queryResult.status == "FAILED")
        console.log(queryResult.comment);
      else {
        // Printing the result
        user = queryResult.result[0];
        console.log('[-] Handle: ' + name(user.handle));
        console.log('[-] Name: ' + user.firstName + ' ' + user.lastName);
        console.log('[-] Rank: ' + user.rank);
        console.log('[-] Best Rank: ' + correct(user.maxRank));
        console.log('[-] Rate: ' + user.rating);
        console.log('[-] Best Rate: ' + correct(user.maxRating));
        console.log('[-] Country: ' + user.country);
        console.log('[-] Organization: ' + user.organization);
        console.log('[-] Number of friends: ' + user.friendOfCount);
        console.log('[-] Number of Contributions: ' + user.contribution);
      }
    }
  });
}



// GET Contest statistics
exports.getContestStatistics = function(handle) {
  // Construct the query url
  var queryUrl = ' http://codeforces.com/api/user.rating?handle=' + handle;
  request(queryUrl, function (error, response, body) {
    // Did we face an error with the request
    if (error)
      console.error(error);
    else {
      // Parse the Result
      var queryResult = JSON.parse(body);
      // Check The result Status
      if (queryResult.status == "FAILED")
        console.log(queryResult.comment);
      else {
        contests = queryResult.result;
        let ratingIncreaseCount = 0;
        let ratingDecreaseCount = 0;
        let ratingNoChangeCount = 0;
        let ratingChanges = [];
        let ratingMaxIncrease = 0;
        let ratingMaxDecrease = 0;
        let maxIncreaseContest;
        let maxDecreaseContest;

        // Checking all the contests this user participated in
        for (var each in contests) {
          let contest = contests[each];
          // Checking the rating change
          let ratingChange =  (contest.newRating - contest.oldRating);
          // Evaluating the change in the rating
          if (ratingChange > 0){                    //INCREASE
            ratingIncreaseCount += 1;
            // Checking for the maximum Increase
            if (ratingChange>=ratingMaxIncrease){
              ratingMaxIncrease = ratingChange;
              maxIncreaseContest = each;
            }
          }
          else if (ratingChange < 0){             //DECREASE
            ratingDecreaseCount += 1;
            // Checking for the maximum Decrease
            if (ratingChange<=ratingMaxDecrease){
              ratingMaxDecrease = ratingChange;
              maxDecreaseContest = each;
            }
          }
          else ratingNoChangeCount += 1;          //NO-CHANGE
        }

        // Printing The Result
        console.log('[-] No. of Contests Joined: ' + contests.length);
        console.log('[-] Rating Increase Count: ' + correct(ratingIncreaseCount));
        console.log('[-] Rating Decrease Count: ' + wrong(ratingDecreaseCount));
        console.log('[-] Rating No-Change Count: ' + ratingNoChangeCount);

        // Printing Maximum rate Increase
        if (maxIncreaseContest) {
            let ratingFrom = contests[maxIncreaseContest].oldRating;
            let ratingTo = contests[maxIncreaseContest].newRating;
            console.log('[-] Largest Rating Increase: ' + correct(ratingFrom + ' -> ' + ratingTo + ': ++' + ratingMaxIncrease));
        }
        else console.log('[-] Rating Never Increased');

        // Printing Maximum rate Decrease
        if (maxDecreaseContest) {
            let ratingFrom = contests[maxDecreaseContest].oldRating;
            let ratingTo = contests[maxDecreaseContest].newRating;
            console.log('[-] Largest Rating Decrease: ' + wrong(ratingFrom + ' -> ' + ratingTo + ': -' + ratingMaxDecrease));
        }
        else console.log('[-] Rating Never Decrease');
      }
    }
  });
}



// Get Submission code
exports.getSubmissionCode = async function(submissionId, contestId) {
  // Construct the query url
  var submissionUrl = 'https://codeforces.com/contest/' + contestId + '/submission/' + submissionId;
  // Call the code extraction function to get the submission code
  var elementsExtracted = await helpers.extractCode(submissionUrl);
  // Parsing the result into JSON
  elementsExtracted = JSON.parse(elementsExtracted);
  // Accessing the code submission
  extractedCode = elementsExtracted.code;

  // REGEX FORMATING THE CODE UNDERR CONSTRUCTION
  extractedCode = extractedCode.replace(/#/g, "\n#");
  extractedCode = extractedCode.replace(/using/g, "\nusing");
  extractedCode = extractedCode.replace(/int main/g, "\nint main");
  extractedCode = extractedCode.replace(/{/g, "\n{\n");
  extractedCode = extractedCode.replace(/}/g, "\n}\n");
  // Printing the result
  console.log(extractedCode);

  // Saving the extractedCode to a CPP file.
  fs.writeFile("submissionCode.cpp", extractedCode, (err)=>{
    if(err)
      console.error(error);
    else
      console.log("Code copied succesfully to the file 'submissionCode.cpp' in the current directory");
  });

}



// Get User Submissions
exports.getUserSubmissions =  function (handle, count) {
  var queryUrl = 'https://codeforces.com/api/user.status?handle=' + handle + "&from=1&count=" + count + 1;
  request(queryUrl, function (error, response, body) {
    // Did we face an error with the request
    if (error)
      console.error(error);
    else {
      // Parse the Result
      var queryResult = JSON.parse(body);
      // Check The result Status
      if (queryResult.status == "FAILED")
        console.log(queryResult.comment);
      else{
        // Get the exact number of submissions requested
        submissions = queryResult.result.slice(0, count + 1);
        // For each submission
        for (i = 0; i < count; ++i) {
          let submission = submissions[i];
          let problem = submission.problem;
          // The Link to the user submission for this problem
          let submissionUrl = link('https://codeforces.com/contest/' + submission.contestId + '/submission/' + submission.id);
          // The Link to this problem of codeforces
          let problemUrl =    link('https://codeforces.com/contest/' + submission.contestId + '/problem/' + problem.index);

          // Problem ID
          console.log('[-] Problem: ' + submission.contestId + problem.index);
          // Problems difficulty
          console.log('[-] Rating: ' + problem.rating);

          // Submission Verdict
          if (submission.verdict != "OK")
            console.log('[-] Verdict: ' + wrong(submission.verdict + " On Test: " + (submission.passedTestCount + 1)));
          else console.log('[-] Verdict: ' + correct('Accepted'));

          console.log('[-] Submission Link: ' + submissionUrl);
          console.log('[-] Problem Name: ' + name(problem.name) + ' , Link: ' + link(problemUrl));
          console.log(lineBreak("\n--------------------------------------------------\n"));
        }
      }
    }
  });
}



// Get Upcoming Contests
exports.getUpcomingContests = function(count) {
  var queryUrl = 'https://codeforces.com/api/contest.list';
  request(queryUrl, function (error, response, body) {
    // Did we face an error with the request
    if (error)
      console.error(error);
    else {
      // Parse the Result
      var queryResult = JSON.parse(body);
      // Check The result Status
      if (queryResult.status == "FAILED")
        console.log(queryResult.comment);
      else {
        contests = queryResult.result;
        // Sort the contests by their start time
        contests.sort(helpers.sortContests);
        // Check if the Contest is finished or not
        for (i = 0; i < contests.length && count>0; ++i) {
          contest = contests[i];
          // If the contest hasn't started yet then print it
          if (contest.phase == "BEFORE") {
            // The Registration Link to this contest
            let registrationLink = 'https://codeforces.com/contestRegistration/' + contest.id;
            // The duration of the contest
            let contestDuration = contest.durationSeconds / 3600;
            console.log('[-] Contest Style : ' + contest.type);
            console.log('[-] Contest Duration : ' + contestDuration + " hours");
            console.log('[-] Contest Name : ' + name(contest.name));
            console.log('[-] Registration Link : ' + link(registrationLink));
            console.log(lineBreak("\n--------------------------------------------------\n"));
            count -= 1;
          }
        }
        // If we couldn't get the required count
        if (count)
          console.log(wrong("SORRY, THAT'S ALL WE HAVE FOR NOW!!"));
      }
    }
  });
}




// Get Recent Actions
exports.getRecentActions = function(count) {
  // Requesting the recent action data from the API
  var queryUrl = 'http://codeforces.com/api/recentActions?maxCount=100';
  request(queryUrl, function (error, response, body) {
    // Did we face an error with the request
    if (error)  console.error(error);
    else {
      // Parse the Result
      var queryResult = JSON.parse(body);
      // Check The result Status
      if (queryResult.status == "FAILED") console.log(queryResult.comment);
      else {
        // Parsing the result
        blogs = queryResult.result;
        // Sort blogs based on the time they were created
        blogs.sort(helpers.sortBlogs);
        var found = [];
        for (var i = 0; i < blogs.length && found.length < count; i++) {
          // Printing The number of recent activities the user wanted
          blog = blogs[i];
          let blogAuthor = blog.blogEntry.authorHandle;
          let blogTitle = blog.blogEntry.title.slice(3, -4);
          let blogUrl = "https://codeforces.com/blog/entry/" + blog.blogEntry.id;

          if (found.includes(blogTitle) == false) {
            found.push(blogTitle); // keeping track of what have been printed to avoid repeatition.
            console.log('[-] Author : ' + name(blogAuthor));
            console.log('[-] Title : ' + title(blogTitle));
            console.log('[-] Link : ' + link(blogUrl));
            console.log(lineBreak("\n--------------------------------------------------\n"));
          }
        }
        // If we couldn't get the required count
        if (found.length != count)
          console.log(wrong("SORRY, THAT'S ALL WE HAVE FOR NOW!!"));
      }
    }
  });
}




// Get Problems: Generats problems for the user.
exports.getProblems = function (handle, count, tag, difficulty) {
  // Call the helper function to get the solved problems by this user
  helpers.getSubmissions(handle, function(data) {
    let solvedProblems = data;
    var queryUrl = 'https://codeforces.com/api/problemset.problems?tags=' + tag;
    request(queryUrl, function (error, response, body) {
      // Did we face an error with the request
      if (error)  console.error(error);
      else{
        // Parse the Result
        var queryResult = JSON.parse(body);
        // Check The result Status
        if (queryResult.status == "FAILED")  console.log(queryResult.comment);
        else {
          var problems = queryResult.result.problems;
          var validProblems = [];
          // For each problem we got back
          for (var i = 0; i < problems.length; ++i) {
            var problem = problems[i];
            // If the problem matches the rating needed and the user didn't solve it yet
            // Add it to our array
            if(problem.rating <= difficulty && solvedProblems.includes(problem.name) == false) {
              let validProblem = {
                Name: problem.name,
                Rating: problem.rating,
                Link: "https://codeforces.com/problemset/problem/" + problem.contestId + "/" + problem.index
              }
              validProblems.push(validProblem);
            }
          }

          // Printing the number of problems requested
          while (validProblems.length > 0 && count > 0) {
            // Shuffle the array so that the generated problems are not the same
            validProblems = shuffle(validProblems);
            problem = validProblems[0];
            console.log("[-] Name : " + name(problem.Name));
            console.log("[-] Rating : " + problem.Rating);
            console.log("[-] URl : " + link(problem.Link));
            console.log(lineBreak("\n--------------------------------------------------\n"));
            // Remove the problem we just printed
            validProblems.shift();
            count -= 1;
          }
          // If we couldn't get the required count
          if (count)
            console.log(wrong("SORRY, THAT'S ALL WE HAVE FOR NOW!!"));
        }
      }
    });
  });
}



// Asking for clarrification, this function is to get the distribution of the tags that the user has solved correct??
// Most of the questions on CF have multible tags so is this function still needed or usefull


// exports.tagsDistribution = function(handle){
//     var accepted_Tags = [];
//     var tagsDictionary = {
//         'implementation' : 0,
//         'dp' : 0,
//         'math' : 0,
//         'greedy' : 0,
//         'brute force' : 0,
//         'data structures' : 0,
//         'constructive algorithms' : 0,
//         'dfs' : 0,
//         'sortings' : 0,
//         'binary search' : 0,
//         'graphs' : 0,
//         'trees' : 0,
//         'strings' : 0,
//         'number theory' : 0,
//         'geometry' : 0,
//         'combinatorics' : 0,
//         'two pointers' : 0,
//         'dsu' : 0,
//         'bitmasks' : 0,
//         'probabilities' : 0,
//         'shortest paths' : 0,
//         'hashing' : 0,
//         'divide and conquer' : 0,
//         'games' : 0,
//         'matrices' : 0,
//         'flows' : 0,
//         'string suffix structures' : 0,
//         'expression parsing' : 0,
//         'graph matchings' : 0,
//         'ternary search' : 0,
//         'meet-in-the-middle' : 0,
//         'fft' : 0,
//         '2-sat' : 0,
//         'chinese remainder theorem' : 0,
//         'schedules' : 0,
//     };

//     request('https://codeforces.com/api/user.status?handle=' + handle, function (error, response, body) {
//         if (error) {
//             console.error(error);
//         } else {
//             var result = JSON.parse(body);
//             if (result.status == "FAILED") {
//                 console.log(result.comment);
//             } else {
//                 result = result.result;
//                 for (i = 0; i < result.length; ++i) {
//                     if (result[i].verdict == "OK") {
//                         var tags= result[i].problem.tags;
//                         accepted_Tags.push(tags);
//                     }
//                 }
//                 for (i = 0; i < accepted_Tags.length; ++ i)
//                 {
//                     for ( j = 0; j < accepted_Tags[i].length; ++j)
//                     {
//                         for (var key in tagsDictionary)
//                         {
//                             if (key == accepted_Tags[i][j]){
//                                 ++ tagsDictionary[key];
//                             }
//                         }
//                     }
//                 }
//                 console.log () ;
//                 console.log("-----------------------------------------------------------------------------------------")
//                 for (i in tagsDictionary){
//                     if (tagsDictionary[i] != 0)
//                     {

//                         process.stdout.write("[-] "+ i + " : "  );
//                         for (var j = 0; j < (tagsDictionary[i] / accepted_Tags.length)*100; ++j)
//                             process.stdout.write( '█');
//                         console.log( "  " + ((tagsDictionary[i] / accepted_Tags.length)*100).toFixed(2) + " % ");
//                         console.log("-----------------------------------------------------------------------------------------")
//                     }
//                 }

//             }
//         }
//     });
// }
