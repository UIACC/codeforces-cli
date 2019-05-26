// Main Packages needed for the functionality
const request = require('request');
const colors = require('colors');
const shuffle = require('shuffle-array');
const cheerio = require('cheerio');
const jsonframe = require('jsonframe-cheerio');
const fs = require('fs');
const got = require('got');


// Setting specific themes used in printing
const correct = colors.green.bold;
const wrong = colors.red.bold;
const name = colors.cyan.bold;
const lineBreak = colors.rainbow;
const link = colors.green.bold.underline;
const title = colors.magenta.bold;


// Helper function for the extract code function
// Scrapping Page for code
async function extractCode(url) {
  // Loading URL
  const html = await got(url)
  //Getting html data
  const $ = await cheerio.load(html.body)
  // initializing the plugin
  jsonframe($)
  // The elements we are looking for in the html
  var frame = {
    code: "#program-source-text"
    };
  // Calling the scrape function
  let code = $('#body div #pageContent .roundbox').scrape(frame, {string: true});
  // Returning the elements extracted
  return code;
}



// Helper function for the Get upcoming contests function
// Sorts contests based on their starting time
function sortContests(contestA, contestB) {
  if (contestA.startTimeSeconds < contestB.startTimeSeconds)
    return -1;
  else
    return 1;
}



// Helper function for the Get recent Actions
// Sorts blogs based on the time they were posted
function sortBlogs(blogA, blogB) {
  if (blogA.timeSeconds < blogB.timeSeconds)  return -1;
  if (blogA.timeSeconds > blogB.timeSeconds)  return 1;
  else return 0;
}


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
  var elementsExtracted = await extractCode(submissionUrl);
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
        contests.sort(sortContests);
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
        blogs.sort(sortBlogs);
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
