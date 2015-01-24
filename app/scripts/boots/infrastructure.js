/**
 * define application boostrap skeleton.
 */
(function() {

    function logInfo() {
        if (console && angular.isObject(console)) {
            console.info.apply(console, arguments);
        }
    };
    //
    // all envs const definition
    // --------------------------------------------------------------------------
    var envs = {
        "cms": {
            "apiRoot": "http://abc.1qianbao.com:8080/mtp-web",
            "env": "cms",
            "cdnRoot": ""
        },
        "ms": {
            "apiRoot": "https://mobile.1qianbao.com/mtp-web",
            "env": "ms",
            "cdnRoot": ""
        },
        "uat": {
            "apiRoot": "https://mobile.uat.1qianbao.com/mtp-web",
            "env": "uat",
            "cdnRoot": ""
        },
        "production": {
            "apiRoot": "https://mobile.1qianbao.com/mtp-web",
            "env": "production",
            "cdnRoot": "https://ms.1qianbao.com/h5"
        },
        //-------------------------------------------------------
        //test evns.
        //=======================================================
        "localhost": {
            // set api root url, default is local mock service url
            "apiRoot": "http://localhost:30000",
            "env": "localhost",
            // provider optional cdnRoot uri for our asset files if deploy it into different server.
            "cdnRoot": "http://localhost:20000"
        },
        "stg1": {
            "apiRoot": "https://114.80.86.110:8443/mtp-web",
            "env": "stg1",
            "cdnRoot": ""
        },
        "stg2": {
            "apiRoot": "https://test2-ms.stg.1qianbao.com:6443/mtp-web",
            "env": "stg2",
            "cdnRoot": ""
        },
        "stg3": {
            "apiRoot": "http://202.105.136.157:8083/mtp-web",
            "env": "stg3",
            "cdnRoot": ""
        },
        "stg5": {
            "apiRoot": "https://test-ms.stg.1qianbao.com:11380/mtp-web",
            "env": "stg5",
            "cdnRoot": ""
        }
    };
    // consts
    var DI_ENV_SETTING_FACTORY = "di_env_settings_factory";
    var DI_ENV_SETTING = "di_env_settings";
    //
    // all envs const definition
    // --------------------------------------------------------------------------
    function _getCurrentEnv() {
        var currHost = window.location.hostname;
        logInfo("currHost: ", currHost);
        // default apiRoot, cdnRoot is production.
        var _remote = envs["production"];
        // for production env.
        if (!currHost || (currHost && currHost == "h5.1qianbao.com")) {
            return _remote;
        }
        var diEnvFactory = angular.fromJson(localStorage.getItem(DI_ENV_SETTING_FACTORY));
        // find from localstorage. ['stg1','stg2','stg3','stg4','stg5','stg6']
        var diEnv = diEnvFactory && diEnvFactory[DI_ENV_SETTING] || "";
        _remote = diEnv && envs[diEnv] || envs["localhost"];
        logInfo("_getCurrentEnv(): ", _remote);
        return _remote;
    };
    // Expose apis
    // save to localstorage. ['stg1','stg2','stg3','stg4','stg5','stg6']
    window.setCurrentEnv = function(evn) {
        var envCfg = {};
        envCfg[DI_ENV_SETTING] = evn;
        localStorage.setItem(DI_ENV_SETTING_FACTORY, angular.toJson(envCfg));
    };
    //  get all env settings.
    window.getAllEnvs = function() {
        return envs;
    };
    // get current env settings.
    window.getCurrentEnv = _getCurrentEnv;
    // remove current evn configuration.
    window.removeCurrentEnvCfg = function() {
        localStorage.removeItem(DI_ENV_SETTING_FACTORY);
    };
    window.remoteApi = _getCurrentEnv();
    //
    // global PafH5.back() implementations.
    // config:{
    //    originalUrl:"",
    //    behavior:"back|forward",
    //    data:{} optional.
    // }
    // --------------------------------------------------------
    var _cachedHash = {},
        JSON = window.JSON;

    var _h5back = function(config) {
        config = config || {};
        //the absolute url indicates where the H5 index page comes from.
        var originalUrl = config.originalUrl || "";
        var data = config.data || null;
        var behavior = config.behavior || "";

        // get cache index page url.
        var indexStates = this.getState("index") || [];

        // current hash index.html#/index?token
        // currentHash should be /index TODOO...
        var currentHash = location.hash && location.hash.split("?")[0];

        if (currentHash.indexOf("#") === 0) {
            currentHash = currentHash.substr(1);
        }
        var hasExitedIndexHashMap = false;
        for (var i = 0; i < indexStates.length; i++) {
            var curr = indexStates[i];
            if (curr.hash === currentHash) {
                // has find.
                hasExitedIndexHashMap = true;
                break;
            }
        };
        // tracking h5 back event from webview.
        logInfo("nav _h5back(): ", config, " indexStates:", indexStates, " currentHash:", currentHash);

        if (originalUrl && hasExitedIndexHashMap) {
            window.location.href = originalUrl;
        } else {
            // directly broswer history back().
            window.history.back();
        }
    };
    // While preparing the build please make sure you hanve done below steps.
    // 1. change debugModel = false,
    // 2. change version to your project release version number.
    // 3. goto project root directory,then run compile.bat/compile.sh
    // 4. check the deployed @directory and run localhost:port/index.html#/xxx to test your pages.

    window.PafH5 = {
        debugModel: angular.isUndefined(window.debugModel) ? true : window.debugModel,
        version: window.appVersion || "",
        appName: window.appName || "H5 Angularjs",
        back: _h5back,
        /**
         * allow us in each page set push state
         * @param  {string} name  the name of currents state
         * @param  {object} state data of current page hash
         * @param  {string} hash  hash location: /index -->
         * index.html#/info?token=7dc1f65b8d7b45ef813c612fdae8e093
         * --> name: "index", state:{}, hash: "/info"
         */
        pushState: function(name, hash, state) {

            var _cacheKey = "pafh5_" + this.appName + "_cachehas";

            // find exited cache hash map.
            if (!_cachedHash[name]) {
                _cachedHash[name] = [];
            }
            // save it.
            _cachedHash[name].push({
                hash: hash,
                state: state
            });

            try {
                localStorage.setItem(_cacheKey, JSON.stringify(_cachedHash));
            } catch (e) {}
        },
        getState: function(name, hash) {
            var cachedHash = _cachedHash[name];
            var find = null;
            if (cachedHash) {
                for (var i = 0; i < cachedHash.length; i++) {
                    var item = cachedHash[i];
                    if (item.hash === hash) {
                        find = item;
                        break;
                    }
                };
            }
            return find;
        }
    };
    // restore 
    (function restoreCachedHash() {
        try {
            var _cacheKey = "pafh5_" + window.PafH5.appName + "_cachehas";

            _cachedHash = JSON.parse(_cacheKey);

        } catch (e) {}

    })();
    // register our home pages.
    window.PafH5.pushState("index", "/home", null);
    window.PafH5.pushState("index", "/index", null);
    window.PafH5.pushState("index", "/info", null);

})();
