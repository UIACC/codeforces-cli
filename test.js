var sys = require('sys');
var optparse = require('optparse');

var switches = [
	['-h', '--help', 'Shows help sections']
];

var parser = new optparse.OptionParser(switches);


parser.on('help', function() {
	sys.puts('Help');
});
