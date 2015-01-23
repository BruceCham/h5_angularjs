'use strict';

/**
 * Designed to automatically deploy all dependant javascript seajs modules
 * into project specific location. Note: make sure that you have do module deployed first!
 * we will first deploy sea-modules folder to project location.
 * then will deploy the project javascript folder...e.g. /static/ it's our external costomized assets
 */
var program = require('commander'),
    log = require("./node-libs/log"),
    colors = require("ansicolors"),
    path = require("path"),
    fs = require("fs-extra"),
    minifier = require("./node-libs/minify");

// command parameters.
program.version('0.0.1')
    .option('-t, --target [type]', 'the dintination directory used to store deployed files.')
    .option('-d, --deploy [type]', 'the module path which will be deploy for this project! ')
    .parse(process.argv);

// node js process working directory.
var cwd = process.cwd(), //read configuration parameters.
    config_deploy_source = program.deploy,
    config_deploy_target = program.target, //deploy target base directory e.e. /deploy/
    deploy_target_base = path.join(cwd, config_deploy_target), //the destination dir of sea-modules deployment.
    deploy_seamodule_target = path.join(deploy_target_base, "sea-modules"), // the source dir of sea-module plugins.
    deploy_seamodule_source = path.join(cwd, "sea-modules");

// the build engine start
// clear deploy root directory files and directories.
(function() {
    log.writeln("clear deploy directory: ", deploy_target_base);
    fs.removeSync(deploy_target_base);
})();

// start to deploy site style theme modules and seajs plugin modules for current application.
(function() {
    // remove seamodule dir if exist, and re-deploy seamodules to destination dir.
    // if source sea module exist then copy it into deploy directory.
    fs.exists(deploy_seamodule_source, function(exist) {
        // if exist seamodule source dir, then deploy it.
        if (exist) {
            fs.mkdirs(deploy_seamodule_target, function(err) {
                if (err) return log.error(err);

                log.writeln("created exist seajs-module`", config_deploy_target, "` directory success! ");
                // is an regex instance.https://github.com/alinex/node-fs#filter
                var filter = null;

                // copy seajs modules to target deploy directory.
                fs.copy(deploy_seamodule_source, deploy_seamodule_target, filter, function(err) {
                    if (err) return log.error(err);
                    log.writeln("deploy sea-modules to directory `" + deploy_seamodule_target + "` successfully! ");
                    // compile our customized components e.g. "./sitetheme_1" , "./sitetheme_1", "../external"
                    // Note: cause of we use seajs module pattern to encapsulte all javascript behavior module, in compile compoents phase,
                    // we only deal with static files and styles files.
                    startCompileComponentModules(config_deploy_source);
                });
            });
        } else {
            //if we have not seaj-modules in local dir, always do other component module buiding task.
            startCompileComponentModules(config_deploy_source);
        }
    });
})();

var toString = Object.prototype.toString;

function isArray(obj) {
    return toString.call(obj) === "[object Array]";
}

function isString(obj) {
    return toString.call(obj) === "[object String]";
}

function isObject(obj) {
    return toString.call(obj) === "[object Object]";
}

function trim(str) {
    return str ? str.replace(/^\s+|\s+$/ig, "") : "";
}
var all_configed_compiled_components = [];

function startCompileComponentModules(build_pathes) {
    log.debug("build components->", build_pathes);
    all_configed_compiled_components = JSON.parse(build_pathes);
    if (!isArray(all_configed_compiled_components)) {
        return log.error("the deploy command parameter `-d` should be an array string");
    }
    compileNextComponent();
}

function compileNextComponent() {
    var lasatedOne = all_configed_compiled_components.shift();
    if (lasatedOne) {
        compileComponent(lasatedOne, compileNextComponent);
    } else {
        // we should not exit process here, because the compile css/js is ansyc it maybe make the
        // compile task down.
        // process.exit(0);
    }
}

function compileComponent(build_path, callback) {
    log.writeln("start to build `", build_path, "`");
    //he base directory of current customized component.
    var component_basedir = path.join(cwd, build_path), //the deploy config file path for current customized component.
        deployConfigPath = component_basedir + "/deploy.json";

    fs.exists(deployConfigPath, function(exist) {
        if (!exist) {
            log.error("Can't find the customized component config:  `" + deployConfigPath + "`");
            callback();
        } else {
            // Get theonfig data from config file. 
            var deployConfig = fs.readJsonSync(deployConfigPath), // Get the target base dir for customized component module.
                component_target_base = path.join(deploy_target_base, deployConfig.target), // Get assets config node info.
                assets = deployConfig.assets, // Get customized component name.
                componentName = deployConfig.name, // Get if force ignore css compile.
                ignoreMinify = deployConfig.ignoreMinify || false;

            // 1. ensure that the component target base dir exist.
            fs.ensureDirSync(component_target_base);

            // 2. Deploy all assets folders defined in deploy.json->assets: ["imagse/", "libs/"..]
            if (assets && isArray(assets)) {
                for (var i = 0; i < assets.length; i++) {
                    var asset_deploy_target = path.join(component_target_base, assets[i]);
                    //makesure that if we have sepecificed an asset child dir folder.
                    if (isObject(deployConfig.output)) {
                        asset_deploy_target = path.join(component_target_base, deployConfig.output["assets"] || "", assets[i]);
                    }
                    var asset_deploy_source = path.join(component_basedir, assets[i]);
                    // Remove current existed deployed item file or directory.
                    fs.removeSync(asset_deploy_target);

                    // if exist deploy source then do it otherwise ignore it.
                    if (fs.existsSync(asset_deploy_source)) {
                        // Copy assets into target folder.
                        fs.copySync(asset_deploy_source, asset_deploy_target);

                        log.writeln("copy `" + build_path + "/" + assets[i] + "` to `" + path.join(config_deploy_target, componentName, assets[i]) + "` successfully ");
                    } else {
                        log.warn("the deploy source can't be found `" + build_path + "/" + assets[i] + "` for `" + componentName + "` ");
                    }
                };
            } else {
                log.warn("task ignored->the `assets` node in deploy.json could't found, it also should be array!");
            }
            // 3. Build/deploy styles, javascript, it will auto indentify the source file extention.css|.js
            // we can ignore js/css files build and deploy process, only deploy assets resources.
            if (!ignoreMinify) {
                var minify_opts = {
                    destdir: component_target_base,
                    output: deployConfig.output
                };
                // the output can be an string or object, convert into {"css":"xxx/xxx.css","js":"xxxx/xx.css"}
                if (isString(deployConfig.output)) {
                    minify_opts.output = {
                        "css": deployConfig.output.replace(/.js$/, "") + ".css",
                        "js": deployConfig.output.replace(/.css$/, "") + ".js"
                    };
                } else if (isObject(deployConfig.output)) {
                    if (!trim(deployConfig.output["css"]) || !trim(deployConfig.output["js"])) {
                        log.error("the [output] must be an object and contains {'css':'','js':''}");
                        callback();
                        return;
                    }
                }

                minifier.attachEvent("compiledone", callback);
                minifier.minify(deployConfig.name, component_basedir, minify_opts);
            } else {
                log.warn("the ignore minify compile config found, skip minify css/js files!");
                callback();
            }
        }
    });
}
