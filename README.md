# codeforces cli
A command-line tool for [codeforces](http://codeforces.com)

### Features
* Get user status
* Check Contests Statistics
* Check the recent actions
* Check the submitted code in a contest
* Generate the latest Submissions
* Check the latest contests
* Generate unsolved problems based on tag and difficulty
* Codeforces tags distribution for user's accepted solutions.

### Commands 
* `cf get-user -u <handle>`
* `cf con-stat -u <handle>`
* `cf re-action -c <number-of-blogs-to-get>`
* `cf sub-code -s <submission-id> -i <contest-id>`
* `cf usr-submission -u <handle> -c <number-of-problems>`
* `cf com-contest -c <maximum-number-of-upcoming-contests>`
* `cf gen-problems -u <handle> -c <number-of-problems> -t <tag> -d <difficulty>`
* `cf tag-codeforces -u <handle >

### Installation
`sudo npm install codeforces-cli -g`
