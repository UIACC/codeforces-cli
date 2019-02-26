var assert = require("assert")
var humanNameParser = require('./../index');

var names =
	[{
	name: "John Doe",
	result: {
		"salutation": "",
		"firstName": "John",
		"initials": "",
		"lastName": "Doe",
		"suffix": ""
	}
}, {
	name: "Mr Anthony R Von Fange III",
	result: {
		"salutation": "Mr.",
		"firstName": "Anthony",
		"initials": "R",
		"lastName": "Von Fange",
		"suffix": "III"
	}
}, {
	name: "Sara Ann Fraser",
	result: {
		"salutation": "",
		"firstName": "Sara Ann",
		"initials": "",
		"lastName": "Fraser",
		"suffix": ""
	}
}, {
	name: "Adam",
	result: {
		"salutation": "",
		"firstName": "Adam",
		"initials": "",
		"lastName": "",
		"suffix": ""
	}
}, {
	name: "Jonathan Smith",
	result: {
		"salutation": "",
		"firstName": "Jonathan",
		"initials": "",
		"lastName": "Smith",
		"suffix": ""
	}
}, {
	name: "Anthony Von Fange III",
	result: {
		"salutation": "",
		"firstName": "Anthony",
		"initials": "",
		"lastName": "Von Fange",
		"suffix": "III"
	}
}, {
	name: "Mr John Doe",
	result: {
		"salutation": "Mr.",
		"firstName": "John",
		"initials": "",
		"lastName": "Doe",
		"suffix": ""
	}
}, {
	name: "Smarty Pants Phd",
	result: {
		"salutation": "",
		"firstName": "Smarty",
		"initials": "",
		"lastName": "Pants",
		"suffix": "PhD"
	}
}, {
	name: "Mark P Williams",
	result: {
		"salutation": "",
		"firstName": "Mark",
		"initials": "P",
		"lastName": "Williams",
		"suffix": ""
	}
}]

describe('Verifiy user extraction', function() {

	describe('test names', function() {
		it('names should produce expected result', function(done) {

			for (var i = 0, j = names.length; i < j; i++) {
				console.log("Check Name  %s ", names[i].name);
				var parsed = humanNameParser.parse(names[i].name);
				assert.equal(JSON.stringify(parsed), JSON.stringify(names[i].result));
			}
			done();
		});
	});
});