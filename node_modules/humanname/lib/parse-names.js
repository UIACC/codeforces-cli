/*
 * Copyright Josh Fraser
 * based on PHP Name Parser by Josh Fraser (joshfraser.com)
 * http://www.onlineaspect.com/2009/08/17/splitting-names/
 * 
 * Copyright Mark Pemburn
 * ported to JavaScript by Mark Pemburn (pemburnia.com)
 *
 * Copyright 2014, Christoph Hartmann
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

'use strict';

function in_array(arr, value) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === value) {
			return true;
		}
	}
	return false;
}

function implode(arr, separator) {
	var output = '';
	var sep = '';
	for (var i = 0; i < arr.length; i++) {
		output += sep + arr[i];
		sep = separator;
	}
	return output;
}

function trim(str) {
	return str.replace(/^\s+|\s+$|\,$/g, '');
}

function ucfirst(str) {
	return str.substr(0, 1).toUpperCase() + str.substr(1, str.length - 1).toLowerCase();
}

function NameParse() {}

// detect and format standard salutations 
// I'm only considering english honorifics for now & not words like 
NameParse.prototype.is_salutation = function (word) {
	// ignore periods
	word = word.replace('.', '').toLowerCase();

	var value = false;
	// returns normalized values
	switch (word) {
	case 'mr':
	case 'master':
	case 'mister':
		value = 'Mr.';
		break;
	case 'mrs':
		value = 'Mrs.';
		break;
	case 'miss':
	case 'ms':
		value = 'Ms.';
		break;
	case 'dr':
		value = 'Dr.';
		break;
	case 'rev':
		value = 'Rev.';
		break;
	case 'fr':
		value = 'Fr.';
		break;
	}

	return value;
};

//  detect and format common suffixes 
NameParse.prototype.is_suffix = function (word) {
	// ignore periods
	word = word.replace(/\./g, '').toLowerCase();
	// these are some common suffixes - what am I missing?
	var suffixArray = [
		'I', 'II', 'III', 'IV', 'V', 'Senior', 'Junior', 'Jr', 'Sr',
		'PhD', 'APR', 'RPh', 'PE', 'MD', 'MA', 'DMD', 'CME'
	];
	for (var i = 0; i < suffixArray.length; i++) {
		if (suffixArray[i].toLowerCase() === word) {
			return suffixArray[i];
		}
	}
	return false;
};

// detect compound last names like "Von Fange"
NameParse.prototype.is_compound_lastName = function (word) {
	word = word.toLowerCase();
	// these are some common prefixes that identify a compound last names - what am I missing?
	var words = [
		'vere', 'von', 'van', 'de', 'del', 'della', 'di', 'da', 'pietro',
		'vanden', 'du', 'st.', 'st', 'la', 'lo', 'ter'
	];
	return in_array(words, word);
};

// single letter, possibly followed by a period
NameParse.prototype.is_initial = function (word) {
	// ignore periods
	word = word.replace('.', '');
	return (word.length === 1);
};

// detect mixed case words like "McDonald"
// returns false if the string is all one case
NameParse.prototype.is_camel_case = function (word) {
	var ucReg = /|[A-Z]+|s/;
	var lcReg = /|[a-z]+|s/;
	return (word.match(ucReg) != null && word.match(lcReg) != null);
};

// ucfirst words split by dashes or periods
// ucfirst all upper/lower strings, but leave camelcase words alone
NameParse.prototype.fix_case = function (word) {
	var me = this;

	// uppercase words split by dashes, like "Kimura-Fay"
	word = me.safe_ucfirst('-', word);
	// uppercase words split by periods, like "J.P."
	word = me.safe_ucfirst('.', word);
	return word;
};

// helper this.for fix_case
NameParse.prototype.safe_ucfirst = function (seperator, word) {
	var me = this;

	var words = [];
	// uppercase words split by the seperator (ex. dashes or periods)
	var parts = word.split(seperator);
	for (var i = 0; i < parts.length; i++) {
		var thisWord = parts[i];
		words[i] = (me.is_camel_case(thisWord)) ? thisWord : ucfirst(thisWord).toLowerCase();
	}
	return implode(words, seperator);
};

// split full names into the following parts:
// - prefix / salutation  (Mr., Mrs., etc)
// - given name / first name
// - middle initials
// - surname / last name 
// - suffix (II, Phd, Jr, etc)
NameParse.prototype.parse = function (fullastName) {
	var me = this;

	fullastName = trim(fullastName);
	// split into words
	var unfilteredNameParts = fullastName.split(' ');
	var name = {};
	var nameParts = [];
	var lastName = '';
	var firstName = '';
	var initials = '';
	var j = 0;
	var i = 0;
	// completely ignore any words in parentheses
	for (i = 0; i < unfilteredNameParts.length; i++) {
		if (unfilteredNameParts[i].indexOf('(') === -1) {
			nameParts[j++] = unfilteredNameParts[i];
		}
	}
	var numWords = nameParts.length;
	// is the first word a title? (Mr. Mrs, etc)
	var salutation = me.is_salutation(nameParts[0]);
	var suffix = me.is_suffix(nameParts[nameParts.length - 1]);
	// set the range for the middle part of the name (trim prefixes & suffixes)
	var start = (salutation) ? 1 : 0;
	var end = (suffix) ? numWords - 1 : numWords;

	// concat the first name
	var word = '';
	for (i = start; i < (end - 1); i++) {
		word = nameParts[i];
		// move on to parsing the last name if we find an indicator of a compound 
		// last name (Von, Van, etc)
		// we use i != start to allow for rare cases where an indicator is actually 
		// the first name (like "Von Fabella")
		if (me.is_compound_lastName(word) && i !== start) {
			break;
		}
		// is it a middle initial or part of their first name?
		// if we start off with an initial, we'll call it the first name
		if (me.is_initial(word)) {
			// is the initial the first word?  
			if (i === start) {
				// if so, do a look-ahead to see if they go by their middle name 
				// for ex: "R. Jason Smith" => "Jason Smith" & "R." is stored as an initial
				// but "R. J. Smith" => "R. Smith" and "J." is stored as an initial
				if (me.is_initial(nameParts[i + 1])) {
					firstName += ' ' + word.toUpperCase();
				} else {
					initials += ' ' + word.toUpperCase();
				}
				// otherwise, just go ahead and save the initial
			} else {
				initials += ' ' + word.toUpperCase();
			}
		} else {
			firstName += ' ' + me.fix_case(word);
		}
	}

	// check that we have more than 1 word in our string
	if ((end - start) > 1) {
		// concat the last name
		for (j = i; j < end; j++) {
			lastName += ' ' + me.fix_case(nameParts[j]);
		}
	} else {
		// otherwise, single word strings are assumed to be first names
		firstName = me.fix_case(nameParts[i]);
	}

	// return the various parts in an array
	name.salutation = (salutation !== false) ? salutation : '';
	name.firstName = (firstName !== '') ? trim(firstName) : '';
	name.initials = (initials !== '') ? trim(initials) : '';
	name.lastName = (lastName !== '') ? trim(lastName) : '';
	name.suffix = (suffix !== false) ? suffix : '';

	return name;
};

exports.NameParse = NameParse;
