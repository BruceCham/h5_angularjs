app.factory("httpRequest", ['$log', '$http', "$q", 'utility', 'appConfig', 'remoteApi',

    function($log, $http, $q, utility, appConfig, remoteApi) {

        // api base url
        var apiBaseUrl = remoteApi.apiRoot;

        // common header, 
        var commonHeader = {
            "Authorization": "Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=="
        };
        // default configurations. no need to use common header now.
        // angular.extend($http.defaults.headers.common, commonHeader);
        // $http.defaults.headers.post
        // $http.defaults.headers.get

        // get current api request url full path string.
        function getRequestUrl(url) {

            // if we providered an api url with "http|s" prefix omit it.
            if (!/^(ftp|http|https):\/\/[^ "]+$/.test(url)) {
                url = apiBaseUrl + url;
            }
            return url;
        };

        // for get request get params parameter
        function getSerializedUrl(url, requestData) {
            var serializedParams = utility.toQueryString(requestData);
            var newUrl = serializedParams ? url.split("?")[0] + "?" + serializedParams : url.split("?")[0];
            return newUrl;
        };
        /**
         * Define global row data result converter.
         */
        var promisecb = {

            success: function(defered, dto, requestData, resp) {
                // converted raw data.
                var result = utility.httpRespDataConverter(resp.data, resp.status);
                // customized dto if available.
                if (dto && angular.isFunction(dto)) {
                    // DTO(result, requestData)
                    result = dto.call(this, result, requestData);
                }
                $log.debug(this.logKey(), utility.stringFormat("success -> converted data from dto {0} ", result));

                defered.resolve(result);
            },
            failed: function(defered, resp) {

                var result = utility.httpRespDataConverter(resp.data, resp.status);

                $log.debug(this.logKey(), utility.stringFormat("failed -> converted data from dto {0}", result));

                defered.reject(result);
            }
        };

        // Expose base http request constructor.
        function BaseHttpRequest() {
            // log key
            this.logKey = function() {
                return this.logAPIUniqueKey || "Not Defined Log Key!";
            };

            // directly output sync result to client, keep code style consistency
            this.promise = function(result) {
                var defered = $q.defer();

                defered.resolve(result);

                return defered.promise;
            };
            /**
             * Provider short cut to get mtp api request data.
             * @param  {object}  data       it will override common data.
             * @param  {object}  extraData  it will merge into baseData.
             * @param  {object}  extraData1  it will merge into baseData1.
             * @return {object}  return new request data.
             */
            this.getRequestData = function(data, extraData, extraData1) {
                return appConfig.getRequestData(data, extraData, extraData1);
            };

            /**
             * provider short cut to create multi methods.
             * @param  {array} methods methods
             */
            function registerMultipleMethods(methods) {
                //@protected.
                this._getDTO = function(config) {
                    var dto;
                    if (angular.isObject(config)) {
                        dto = config.dto;
                        delete config.dto;
                    }
                    return dto;
                };
                //@protected.
                this._getSuccessCb = function(config) {
                    var success = promisecb.success;
                    if (angular.isObject(config) && config.success) {
                        success = config.success;
                        delete config.success;
                    }
                    return success;
                };
                for (var i = 0; i < methods.length; i++) {

                    var method = methods[i].toUpperCase();

                    switch (method) {
                        case "GET":
                            /**
                             * the get request
                             * @param  {string} url            api request url.
                             * @param  {object} requestData    {name:'username', password:''}
                             * @param  {object/Function} config required, configJson {dto:fn, headers:{},cache:true}
                             * usage: if config is function, it will use as dto, we can also define dto in config: {dto:fn}
                             * dto:function(result, reqData)();
                             */
                            this["getRequest"] = function(url, requestData, config) {
                                // get serialized data Url for get request.
                                url = getSerializedUrl(getRequestUrl(url), requestData);
                                // customized defered.
                                var defered = $q.defer();

                                if (angular.isFunction(config)) {
                                    config = {
                                        dto: config
                                    };
                                }
                                // defined dto here.
                                var dto = this._getDTO(config);
                                var success = this._getSuccessCb(config);

                                $http.get(url, config).then(
                                    angular.bind(this, success, defered, dto, requestData),
                                    angular.bind(this, promisecb.failed, defered)
                                );
                                return defered.promise;
                            };
                            break;

                        case "POST":

                            this["postRequest"] = function(url, requestData, config) {
                                // customized defered.
                                var defered = $q.defer();

                                if (angular.isFunction(config)) {
                                    config = {
                                        dto: config
                                    };
                                }
                                //defined dto here.
                                var dto = this._getDTO(config);
                                var success = this._getSuccessCb(config);

                                $http.post(getRequestUrl(url), requestData || {}, config)
                                    .then(
                                        angular.bind(this, success, defered, dto, requestData),
                                        angular.bind(this, promisecb.failed, defered)
                                    );
                                return defered.promise;
                            };
                            break;
                    };
                };
            };
            //
            // invoke shortcut to create base http request helper methods
            // -----------------------------------------------------------
            registerMultipleMethods.call(BaseHttpRequest.prototype, ['GET', 'POST']);
        };
        return BaseHttpRequest;
    }
]);
