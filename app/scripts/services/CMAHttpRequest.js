(function() {
    function CMAHttpRequest($log, BaseHttpRequest, utility, dialog, helper) {

        function Child() {

            BaseHttpRequest.call(this);

            // each service must be defined this key used to flag current request belong to.
            this.logAPIUniqueKey = "[CMAHttpRequest]";

            //
            //
            // --------------------------------------------------

            //@protected.
            this._parent = Child.uber;

            //  @protected provider base dto to capture all request for child request.
            this._clampDto = function(result) {
                //code ==1024，表示cookie对应的登录session过期
                //code ==1179，表示c门户带过的token过期
                var code = result.code;
                if (code == "1024" || code == "1179") {
                    // session expired.
                    result.code = "999999";
                }
                // if return false,null, undefined, ignore clampDTO.
                return result;
            };

            // @protected, override getDTO.
            this._getDTO = function(config) {
                // get original dto.
                var orginalDto = this._parent._getDTO(config);

                // return dto result.
                return angular.bind(this, function(result) {
                    // get base dto result.
                    var baseDTOResult = this._clampDto.call(this, result);
                    // get bisuness dto result.
                    return orginalDto.call(this, baseDTOResult);
                });
            };
            //@protected.
            this._success = function(defered, dto, requestData, resp) {
                // converted raw data.
                var result = utility.httpRespDataConverter(resp.data, resp.status);
                // customized dto if available.
                if (dto && angular.isFunction(dto)) {
                    // DTO(result, requestData)
                    result = dto.call(this, result, requestData);
                }
                $log.debug(this.logKey(), utility.stringFormat("success -> converted data from dto {0} ", result));

                if (result.code != "999999") {
                    defered.resolve(result);
                } else {
                    // stop don't send promise resolve().
                    dialog.alert(result.message, {
                        preCloseCallback: function() {
                            $log.debug("SESSION Expired!");
                            helper.returnApp();
                        }
                    });
                }
            };
            /**
             * override parent post request
             * @param  {string} url            api request url.
             * @param  {object} requestData    {name:'username', password:''}
             * @param  {object/Function} config required, configJson {dto:fn, headers:{},cache:true}
             * usage: if config is function, it will use as dto, we can also define dto in config: {dto:fn}
             * dto:function(result, reqData)();
             */
            this.postRequest = function(url, requestData, config) {
                var _config = {};
                if (angular.isFunction(config)) {
                    _config.dto = config;
                } else if (angular.isObject(config)) {
                    _config = config;
                }
                _config.success = this._success;

                return this._parent.postRequest.call(this, url, requestData, _config);
            };
        };

        inherit(Child, BaseHttpRequest);

        // return child instance.
        return Child;
    };
    // expose service contract.
    app.factory('CMAHttpRequest', ['$log', 'httpRequest', 'utility', 'dialog', 'helper', CMAHttpRequest]);
})(app);
