// Packages needed for the helper functions
const got = require('got');
const request = require('request');
const cheerio = require('cheerio');
const jsonframe = require('jsonframe-cheerio');


// Helper function for the extract code function
// Scrapping Page for code
exports.extractCode = async function(url) {
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
exports.sortContests = function(contestA, contestB) {
  if (contestA.startTimeSeconds < contestB.startTimeSeconds)
    return -1;
  else
    return 1;
}



// Helper function for the Get recent Actions
// Sorts blogs based on the time they were posted
exports.sortBlogs = function(blogA, blogB) {
  if (blogA.timeSeconds < blogB.timeSeconds)  return -1;
  if (blogA.timeSeconds > blogB.timeSeconds)  return 1;
  else return 0;
}


// Helper function for the function generate problems
// Gets the solved problems for a given user
exports.getSubmissions = function(handle, _callback){
  var queryUrl = 'https://codeforces.com/api/user.status?handle=' + handle;
  request(queryUrl, function (error, response, body) {
    // Did we face an error with the request
    if (error) console.error(error);
    else{
      // Parse the Result
      var queryResult = JSON.parse(body);
      // Check The result Status
      if (queryResult.status == "FAILED")  console.log(queryResult.comment);
      else{
        var solvedProblems = [];
        submissions = queryResult.result;
        // for all the submissions by this user
        for (i = 0; i < submissions.length; ++i) {
          submission = submissions[i];
          problem = submission.problem;
          // Check if this submission was accepted
          if (submission.verdict == "OK") {
            var problem_name = problem.name;
            // If the problem is accepted and we never added it before then add it
            if (solvedProblems.includes(problem_name) == false)
              solvedProblems.push(problem_name);
            }
          }
        }
      _callback(solvedProblems);
      }
    });
  }
