const readline = require('readline-sync');
const https = require('https');
var exit = false;
var choice;
while(!exit){
	process.stdout.write('\033c');
	
	console.log("Welcom to the CodeForces CLI Tool\n\n");
	console.log("What would you like to do? (enter number) \n");
	console.log("1- get contest standing\n2- get user data\n3-get problems\n0- Terminate the program");
	choice = readline.question();

	switch(choice){
		case '1':
			console.log("you chose to get the contest standing\n");
			break;
		case '2':
			console.log("you chose to get the contest standing\n");
			break;
		case '3':
			console.log("you chose to get the contest standing\n");
			break;
	}
	var check = readline.question("Press 1 to continue or 0  to exit:\n");
	if (check == 0) {
		exit = true;
	}
}
function userStatus (handle){
	const url = "https://codeforces.com/api/user.status?handle="+handle;
	https.get (url,res => {
		let body = " ";
		res.on ('data', data => {
			body += data;
		})
		res.on ('end', () => console.log (body))
	}
	)
}