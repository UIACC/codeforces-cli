#!/usr/bin/env node

const request = require('request');
const args = require('args-parser')(process.argv);

if (args["get-user"]) {
  if (args["u"] || args["user"]) {
    handle = args["u"] || args["user"];
    request('http://codeforces.com/api/user.info?handles=' + handle, function (error, response, body) {
        if (error) {
            console.error(error);
        } else {
            var result = JSON.parse(body);
            if (result.status == "FAILED") {
                console.log(result.comment);
            } else {
                result = result.result[0];
                console.log('[-] Handle: ' + handle);
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
} else if (args["con-stat"]) {
// TODO:


} else if (args["gen-problem"]) {
// TODO:


} else if (args["rec-act"]) {
// TODO:


} else if (args["usr-submission"]) {
// TODO:


} else if (args["sub-code"]) {
// TODO:


} else if (args["com-contest"]) {
// TODO:


} else{
  // TODO:
  console.log("Invalid Function");
}
