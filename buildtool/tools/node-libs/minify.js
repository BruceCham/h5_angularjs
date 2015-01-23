/* jshint node: true */
var fs = require("fs"),
    path = require("path"),
    walker = require("./walker"),
    uglify = require("../../node_modules/uglify-js"),
    CleanCSS = require("../../node_modules/clean-css"),
    program = require('../../node_modules/commander');
var log = require("./log");
var basename = path.basename(__filename),
    w = console.log,
    e = console.error,
    opt = {};
// Shimming path.relative with 0.8.8's version if it doesn't exist
if (!path.relative) {
    path.relative = require('./path-relative-shim').relative;
}
opt.srcdir = opt.srcdir || process.cwd();
// ...but we still want to (relatively) track the top of the
// tree, because this is the root from which the LESS sheets
// are resolved (unlike the JS dependencies, which are
// resolved from the folder of the top-level package.js).
opt.relsrcdir = path.relative(opt.srcdir, process.cwd());


// properly split path based on platform

function pathSplit(inPath) {
    var sep = process.platform == "win32" ? "\\" : "/";
    return inPath.split(sep);
}

function concatCss(sheets, doneCB) {
    w("");
    var blob = "";
    var addToBlob = function(sheet, code) {
        // fix url paths
        code = code.replace(/url\([^)]*\)/g, function(inMatch) {
            // find the url path, ignore quotes in url string
            var matches = /url\s*\(\s*(('([^']*)')|("([^"]*)")|([^'"]*))\s*\)/.exec(inMatch);
            var urlPath = matches[3] || matches[5] || matches[6];

            // handle the case url('') or url("").
            if (!urlPath) {
                return "url()";
            }
            // skip an external url (one that starts with <protocol>: or just //, includes data:)
            if (/^([\w-]*:)|(\/\/)/.test(urlPath)) {
                return "url('" + urlPath + "')";
            }

            // Make relative asset path from 'top-of-the-tree/build'
            // var relPath = path.join("..", opt.relsrcdir, path.dirname(sheet), urlPath);
            var _tmpPath = path.relative(path.dirname(sheet), opt.srcdir);

            // hot fix for cma
            _tmpPath = _tmpPath.replace(/\.\.$/, "");

            relPath = urlPath.slice(_tmpPath.length);

            if (process.platform == "win32") {
                relPath = pathSplit(relPath).join("/");
            }
            // console.log("opt.relsrcdir:", opt.relsrcdir);
            // console.log("sheet:", sheet);
            console.log("urlPath:", urlPath);
            console.log("relPath:", relPath);
            // console.log("path.dir: ", path.dirname(sheet));
            return "url('" + relPath + "')";
        });
        // minify styles here.
        // 
        code = new CleanCSS({
            noAdvanced: true
        }).minify(code);
        blob += "\n/* " + path.relative(process.cwd(), sheet) + " */\n" + code + "\n";
    };
    // Pops one sheet off the sheets[] array, reads (and parses if less), and then
    // recurses again from the async callback until no sheets left, then calls doneCB

    function readAndParse() {
        var sheet = sheets.shift();
        if (sheet) {
            w(sheet);
            var isLess = (sheet.slice(-4) == "less");
            if (isLess && (opt.less !== true)) {
                sheet = sheet.slice(0, sheet.length - 4) + "css";
                isLess = false;
                w(" (Substituting CSS: " + sheet + ")");
            }
            var code = fs.readFileSync(sheet, "utf8");
            if (isLess) {
                var parser = new(less.Parser)({
                    filename: sheet,
                    paths: [path.dirname(sheet)]
                });
                parser.parse(code, function(err, tree) {
                    if (err) {
                        console.error(err);
                    } else {
                        addToBlob(sheet, tree.toCSS());
                    }
                    readAndParse(sheets);
                });
            } else {
                addToBlob(sheet, code);
                readAndParse(sheets);
            }
        } else {
            doneCB(blob);
        }
    }
    readAndParse();
}

var concatJs = function(loader, scripts) {
    w("");
    var blob = "";
    for (var i = 0, script;
        (script = scripts[i]); i++) {
        w(script);
        blob += "\n// " + path.relative(process.cwd(), script) + "\n" + compressJsFile(script) + "\n";
    }
    return blob;
};

var compressJsFile = function(inPath) {
    var outputOpts = {
        //          beautify: false,
        //          indent_level: 4,
        ascii_only: true
    };
    if (opt.beautify) {
        outputOpts.beautify = true;
        outputOpts.indent_level = 4;
    }
    var result = uglify.minify(inPath, {
        output: outputOpts
    });
    return result.code;
};

var walkerFinished = function(loader, chunks) {
    // console.log("walker walkerFinished...");
    var cssOutFolder = path.dirname(path.join(opt.destdir, opt.output["css"]));
    var jsOutputFolder = path.dirname(path.join(opt.destdir, opt.output["js"]));

    var exists = fs.existsSync || path.existsSync;
    var currChunk = 1;
    var topDepends;
    // create css output dir folder.
    if (cssOutFolder != "." && !exists(cssOutFolder)) {
        fs.mkdirSync(cssOutFolder);
    }
    // create js output dir folder.
    if (jsOutputFolder != "." && !exists(jsOutputFolder)) {
        fs.mkdirSync(jsOutputFolder);
    }
    if ((chunks.length == 1) && (typeof chunks[0] == "object")) {
        topDepends = false;
        currChunk = "";
    } else {
        topDepends = [];
    }
    var processNextChunk = function(done) {
        if (chunks.length > 0) {

            var chunk = chunks.shift();
            if (typeof chunk == "string") {
                topDepends.push(chunk);
                processNextChunk(done);
            } else {
                concatCss(chunk.sheets, function(css) {

                    // add compiled time: new date();
                    var compiledTime = new Date();

                    if (css.length) {
                        w("");

                        css = "/* Compiled Time: " + compiledTime + "*/\n" + css;
                        var cssFile = opt.output["css"] + currChunk; // + ".css";
                        fs.writeFileSync(path.resolve(opt.destdir, cssFile), css, "utf8");
                        if (topDepends) {
                            topDepends.push(cssFile);
                        }
                    }
                    var js = concatJs(loader, chunk.scripts);
                    if (js.length) {
                        w("");

                        js = "/* Compiled Time: " + compiledTime + "*/\n" + js;
                        var jsFile = opt.output["js"] + currChunk; // + ".js";
                        fs.writeFileSync(path.resolve(opt.destdir, jsFile), js, "utf8");
                        if (topDepends) {
                            topDepends.push(jsFile);
                        }
                    }
                    currChunk++;
                    processNextChunk(done);
                });
            }
        } else {
            done();
        }
    };
    processNextChunk(function() {
        if (topDepends) {
            fs.writeFileSync(path.resolve(opt.destdir, opt.output["css"] /* + ".css"*/ ), "/* CSS loaded via enyo.depends() call in " + opt.output + ".js */", "utf8");
        }

        // w("");
        w("---======this minify has done=======---.");
        w("");
        // required to properly terminate a
        // node.process.fork() call, as defined by
        // <http://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options>
        eventHandler.fire("compiledone", {
            compiler_status: 'done'
        });
        // process.exit(0); // in order to compile multi resource, dont't exist proccess.
    });
};
// Send message to parent node process, if any
process.on('uncaughtException', function(err) {
    e(err.stack);
    if (process.send) {
        // only available if parent-process is node
        process.send({
            error: err
        });
    }
    process.exit(1);
});
// receive error messages from child node processes
process.on('message', function(msg) {
    console.dir(basename, msg);
    if (msg.error && msg.error.stack) {
        console.error(basename, msg.error.stack);
    }
    if (process.send) {
        process.send(msg);
    }
});

// Extends by terence tian
var Event = function() {
    this.handlers = {};
    this.addEventHandler = function(type, handler) {
        if (!this.handlers[type]) {
            this.handlers[type] = [];
        }
        if (this.hasHandler(type, handler) === null) {
            this.handlers[type].push(handler);
        }
    };
    this.hasHandler = function(type, handler) {
        var find = null;
        var _handlers = this.handlers[type];
        if (_handlers) {
            for (var i = 0; i < _handlers.length; i++) {
                if (_handlers === handler) {
                    find = i;
                    break;
                }
            };
        }
        return find;
    };
    this.removeHandler = function(type, handler) {
        var found = this.hasHandler(type, handler)
        if (found !== null) {
            this.handlers[type].splice(found, 1);
        }
    };
    this.fire = function(type, data) {
        var _handlers = this.handlers[type];
        for (var i = 0; i < _handlers.length; i++) {
            var handler = _handlers[i];
            handler.call(this, data);
        };
    };
};
var eventHandler = new Event();

module.exports = {
    // event: 'compiledone'
    attachEvent: function(type, handler) {
        eventHandler.addEventHandler(type, handler);
        // console.log(eventHandler.handlers["compiledone"].length)
    },
    minify: function(cpmName, cpmRootPath, options) {
        // console.log("invole minify augments: ", cpmName, cpmRootPath, options);
        opt.destdir = options.destdir;
        opt.output = options.output; // {"css":"","js":"dirpath"}
        // the desting path is path.join(opt.destdir,opt.output["css"]|["js"])
        opt.srcdir = cpmRootPath; //source directory.
        walker.init(cpmName, cpmRootPath);
        walker.walk(cpmRootPath + "/package.js", walkerFinished);
    }
};
