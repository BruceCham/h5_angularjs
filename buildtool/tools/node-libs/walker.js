var fs = require("fs");
var path = require('path');

//
// setup DOM-like sandbox
//

var window = {};
var loader;

var script = function(inPath) {
	eval(fs.readFileSync(inPath, "utf8"));
};

var chunks = [];

var pushChunkFile = function(inType, inFile) {
	// console.log("pushChunkFile:", inType, inFile);
	var chunk = chunks.slice(-1)[0];
	if (!chunk || !chunk[inType]) {
		chunk = { sheets:[], scripts:[] };
		chunks.push(chunk);
	}
	chunk[inType].push(inFile);
};

module.exports = {
	// cmpName: build style components name, cpmDir: component full path dir.
	init: function(cmpName, cpmDir) {
		// Always use the Enyo loader that comes with _this_ walker
		script(path.join(process.cwd(), "tools/node-libs/loader.js"));

		loader = new enyo.loaderFactory({
			script: function(inScript) { 
				pushChunkFile("scripts", path.join(cpmDir,inScript));
			},
			sheet: function(inSheet) {
				pushChunkFile("sheets", path.join(cpmDir,inSheet));
			}
		});
		loader.loadPackage = function(inScript) {
			script(path.join(cpmDir,inScript));
		};
		enyo.depends = function() {
			// console.log("depends:",arguments);
			loader.load.apply(loader, arguments);
		};
	},
	walk: function(inScript, inCallback) {
		loader.finish = function() {
			inCallback(loader, chunks);
		};
		script(inScript);
	}
}