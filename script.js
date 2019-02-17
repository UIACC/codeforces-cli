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
			var handle = readline.question("Enter CodeForces handle: ");
			userStatus(handle);
			break;
		case '2':
			console.log("you chose to get the contest standing\n");
			break;
		case '3':
			console.log("you chose to get the contest standing\n");
			break;
	}
	var check = readline.question("Press 1 to continue or 0  to exit:\n");
}



function userStatus (a){
	const url = "https://codeforces.com/api/user.status?handle="+a;
	https.get (url,res => {
		let body = " ";
		res.on ('data', data => {
			body += data;
		})
		res.on ('end', () => console.log (body))
	}
	)
}