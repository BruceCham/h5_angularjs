(function() {
    function ConfigService($log, BaseHttpRequest, cmsStatics) {

        function Child() {
            // inherits base http request infrustrature.
            BaseHttpRequest.call(this);
            
            // each service must be defined this key used to flag current request belong to.
            this.logAPIUniqueKey = "[ConfigService]";
            // 商户app带入，通过加在入口文件的queryString中
            // this.token= '';
            // this.phone= '';
            // this.identityNum= '';
            // this.realName= '';
            this.cmsStatics = cmsStatics;
            //
            // --------------------------------------------------
            //  dtos
            this.getMerchantInfoDto = function(result) {
                result.code = result.code ? result.code : '1000';
                result.message = result.message ? result.message : '请求成功';
                return result;
            };
        };
        // inherits prototype methods from httpRequest.
        inherit(Child, BaseHttpRequest);

        // Expose service request apis to consumer.
        angular.extend(Child.prototype, {
            /**
             * [getMerchantInfo 根据商户号获取商户信息]
             * @param  {[string]} merchantNo [商户号]
             * @return {[object]} [商户信息的json]
             */
            getMerchantInfo: function(merchantNo) {
                var merchantUrl = this.cmsStatics["MERCHANT_CONFIG"].replace("{0}", merchantNo);
                var promise = this.getRequest(merchantUrl, null, {
                    dto: this.getMerchantInfoDto,
                    withCredentials: false
                });
                return promise;
            }
        });

        return new Child();
    };

    // expose service contract.
    app.service('ConfigService', ['$log', 'CMAHttpRequest', 'cmsStatics', ConfigService]);
})(app);
