// Main Packages needed for the functionality
const request = require('request');
const colors = require('colors');
const shuffle = require('shuffle-array');
const cheerio = require('cheerio')
const jsonframe = require('jsonframe-cheerio')
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
