#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));

var handle = argv["_"][0];

var request = require('request');
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