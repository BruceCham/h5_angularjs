'use strict';

var util = require("util")
	, colors = require("ansicolors")
	, format = util.format;

// debug helper out string with
var debug = function () {
	var result = format.apply(format, arguments);
	util.debug(result);
};

//write string new line with green color.
var writeln=  function () {
 	var result = format.apply(format, arguments);
	util.log(colors.green(result));
};

var error = function () {
	var result = format.apply(format, arguments);
	util.log(colors.red(result));
};

var warn = function () {
	var result = format.apply(format, arguments);
	util.log(colors.yellow(result));
}

module.exports =  {
	debug: debug,
	error: error,
	writeln: writeln,
	warn: warn
};