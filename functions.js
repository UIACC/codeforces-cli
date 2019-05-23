// Main Packages needed for the functionality
const request = require('request');
const colors = require('colors');
const shuffle = require('shuffle-array');
const cheerio = require('cheerio');
const jsonframe = require('jsonframe-cheerio');
const fs = require('fs');
const got = require('got');

// GET User information
exports.getUserInfo = function(handle) {
  // Construct the query url
  queryUrl = 'http://codeforces.com/api/user.info?handles=' + handle;
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
        console.log('[-] Handle: ' + user.handle);
        console.log('[-] Name: ' + user.firstName + ' ' + user.lastName);
        console.log('[-] Rank: ' + user.rank);
        console.log('[-] Best Rank: ' + user.maxRank);
        console.log('[-] Rate: ' + user.rating);
        console.log('[-] Best Rate: ' + user.maxRating);
        console.log('[-] Country: ' + user.country);
        console.log('[-] Organization: ' + user.organization);
        console.log('[-] Number of friends: ' + user.friendOfCount);
        console.log('[-] Number of Contributions: ' + user.contribution);
      }
    }
  });
}



// GET Contest statistics
exports.contestStatistics = function(handle) {
  // Construct the query url
  queryUrl = ' http://codeforces.com/api/user.rating?handle=' + handle;
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
        console.log('[-] Rating Increase Count: ' + ratingIncreaseCount);
        console.log('[-] Rating Decrease Count: ' + ratingDecreaseCount);
        console.log('[-] Rating No-Change Count: ' + ratingNoChangeCount);

        // Printing Maximum rate Increase
        if (maxIncreaseContest) {
            let ratingFrom = contests[maxIncreaseContest].oldRating;
            let ratingTo = contests[maxIncreaseContest].newRating;
            console.log('[-] Largest Rating Increase: ' + ratingFrom + ' -> ' + ratingTo + ': ++' + ratingMaxIncrease);
        }
        else console.log('[-] Rating Never Increased');

        // Printing Maximum rate Decrease
        if (maxDecreaseContest) {
            let ratingFrom = contests[maxDecreaseContest].oldRating;
            let ratingTo = contests[maxDecreaseContest].newRating;
            console.log('[-] Largest Rating Decrease: ' + ratingFrom + ' -> ' + ratingTo + ': -' + ratingMaxDecrease);
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


// Scrapping Page for code
async function extractCode(url) {
  // Loading URL
  const html = await got(url)
  //Getting html data
  const $ = cheerio.load(html.body)
  // initializing the plugin
  jsonframe($)
  // The elements we are looking for in the html
  var frame = {
    code: {
        _s: ".roundbox",
        _d: "#program-source-text"
      }
    };
  // Calling the scrape function
  var code = $('#body div#pageContent').scrape(frame, {string: true});
  // Returning the elements extracted
  return code;
}
