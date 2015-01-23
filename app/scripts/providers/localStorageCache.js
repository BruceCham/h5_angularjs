/**
 * Customized local storage cache factory.
 */
app.factory("localStorageCache", ["$log", "appConfig",
    function($log, appConfig) {
        var cacheFactories = {};

        var LOCAL_STORAGE_FACTORY_PREFIX = appConfig.getAppName() + "_" || "NONE";

        if (!supports_html5_storage()) {
            throw angular.$$minErr('localStorageCache')('localstorage', "the localstorage is not available!");
            return;
        }

        function getUid(uid) {
            if (!!~uid.indexOf(LOCAL_STORAGE_FACTORY_PREFIX)) {
                return uid;
            }
            return LOCAL_STORAGE_FACTORY_PREFIX + uid;
        };
        // cache factory.
        function CacheFactory(factoryId, data) {
            this.uid = getUid(factoryId);
            this.data = data || {};
            $log.debug("Cache Factory Instance ..`data:`", data, '`factory uid: `', factoryId);
        };
        angular.extend(CacheFactory.prototype, {
            //ref  the boolean that indicates if the value passed as the same object. default is cloned data.
            put: function(key, value, ref) {
                this.data[key] = ref ? value : angular.copy(value);
                this.save();
                return value;
            },
            get: function(key) {
                return this.data[key];
            },
            remove: function(key) {
                delete this.data[key];
                this.save();
            },
            save: function() {
                // localStorage.setItem(this.uid, angular.toJson(this.data));
                save2Storage(this.uid, this.data);
            },
            destory: function() {
                delete cacheFactories[this.uid];
                localStorage.removeItem(this.uid);
                return null;
            }
        });
        // restore default cache data from localstoreage.
        var restore = function() {
            $log.info("restore localstoreage data into app cache.");
            for (var factoryId in localStorage) {
                if (!!~factoryId.indexOf(LOCAL_STORAGE_FACTORY_PREFIX)) {
                    // each cache factory instance.
                    cacheFactories[factoryId] = new CacheFactory(factoryId, angular.fromJson(localStorage[factoryId]));
                }
            }
        }();

        // save cache data to localstorage.
        var save2Storage = function(cacheId, data) {
            $log.debug("save data to localStorage!", data);
            localStorage.setItem(cacheId, angular.toJson(data));
        };

        function supports_html5_storage() {
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
        };

        function LocalStorageCache(factoryId, options) {
            if (!supports_html5_storage()) {
                throw angular.$$minErr('localStorageCache')('localstorage', "the localstorage is not available!");
            }
            // get system factory id.
            var _sysfactoryId = getUid(factoryId);

            if (_sysfactoryId in cacheFactories) {
                $log.warn('localStorageCache factory cacheId {' + factoryId + '} is already taken!');
            }
            return cacheFactories[_sysfactoryId] || (cacheFactories[_sysfactoryId] = new CacheFactory(factoryId));

        };
        // varify if cache key has been already token!
        LocalStorageCache.get = function(cacheFactoryId) {
            return cacheFactories[getUid(cacheFactoryId)];
        };
        return LocalStorageCache;
    }
]);
