'use strict';
/**
 * Designed to build/deploy seajs modules.
 * Make sure that you have install spm, node plugins.
 * npm install in root directory package.js devDependencies
 */
var program = require('commander')
  , log     = require("./node-libs/log")
  , colors  = require("ansicolors")
  , path    = require("path")
  , fs      = require("fs-extra");

program.version('0.0.1')
  .option('-p, --path [type]', 'current seajs module pwd directory!')
  .option('-m, --module [type]', 'deploy specific module')
  .parse(process.argv);

// from command line arguments get module name -m.
var sea_lib_path = program.path
  , packagePath  = sea_lib_path + "/package.json";

// print sea lib path.
log.writeln("found seajs module path: `", sea_lib_path, "` ");

// create module dir.
var createModuleDir = function(path, callback) {
    fs.mkdirs(path, function(err) {
        if (err) {
            log.error(err);
        } else {
            log.writeln('directory `' + path + '` created');
            if (callback) callback();
        }
    });
};
// http://jprichardson.github.com/node-fs-extra/
var copyFiles2Dir = function(target, dist) {
    var cwd = process.cwd();
    // convert relative path into absolute path.
    dist = path.join(cwd, dist);
    // console.log("target",target);
    // console.log("dist", dist);
    fs.copy(target, dist, function(err) {
        if (err) return console.error(err);
        log.writeln("deploy to '" + dist + "' successfully! ");
    });
};
fs.exists(packagePath, function(exist) {
    if (exist) {
        // get package.json, covert it into packageJson
        var packageJson = fs.readJsonSync(packagePath);
        // fetch necessary configurations.
        var seaModuleCfg = {
            //optional parameter.
            //Note: new version seajs don't support family configuration
            //and it use standard code style of nodejs module.
            family: packageJson.family ||"", 
            name: packageJson.name,
            version: packageJson.version
        };
        log.writeln("read sea plugin package configuration from package.json->", seaModuleCfg);
        // delete directory created by current version
        var sea_module_path = path.join("..", "sea-modules", seaModuleCfg.family, seaModuleCfg.name, seaModuleCfg.version);
        
        log.writeln("deploy sea-modules target relative path->", sea_module_path);
        
        fs.exists(sea_module_path, function(exist) {
            if (exist) {
                log.writeln("target relative path has existed!");
                // delete it first
                fs.remove(sea_module_path, function(err) {
                    if (err) throw err;
                    log.writeln('remove existed target sea-module ',seaModuleCfg, '`successfully! ');
                    createModuleDir(sea_module_path, function() {
                        // deploy dist files.
                        copyFiles2Dir(path.join(sea_lib_path, "dist", seaModuleCfg.name, seaModuleCfg.version), sea_module_path);
                    });
                });
            } else {
                createModuleDir(sea_module_path, function() {
                    // deploy dist files.
                    copyFiles2Dir(path.join(sea_lib_path, "dist", seaModuleCfg.name, seaModuleCfg.version), sea_module_path);
                });
            }
        });
    } else {
        log.error("could not find the `package.json` ");
    }
});
