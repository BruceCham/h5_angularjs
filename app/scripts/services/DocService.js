(function() {
    function DocService($log, BaseHttpRequest) {

        function Child() {

            // inherits base http request infrustrature.
            BaseHttpRequest.call(this);

            // each service must be defined this key used to flag current request belong to.
            this.logAPIUniqueKey = "[DocService]";

            //
            // --------------------------------------------------
            //  dtos {code<string>, message<string>, data<any>}
            //
            this.testSuccessDto = function(result) {
                var data = result.data;
                result.data = {
                    user: data.user
                };
                return result;
            };
        };
        // inherits prototype methods from httpRequest.
        inherit(Child, BaseHttpRequest);

        // Expose service request apis to consumer.
        angular.extend(Child.prototype, {
            testSuccess: function(username) {
                var promise = this.postRequest("/testApi/testSuccess.json", {
                    username: username
                }, this.testSuccessDto);
                return promise;
            },
            /**
             * trySendOTP API
             * @method trySendOTP
             * @param  {number}         phone mobile phone number.
             * @param  {Function} cb    callback
             * callback (result)
             * if result.code=="000000"
             *     {maskedMobile,retrySeconds}
             * else
             *     {captchaId, captchaUrl}
             * @author [lacmo]
             */
            trySendOTP: function(phone, captchaToken, deviceId, extraData, cb) {
                var reqData = this.getRequestData({
                    operationType: "/h5/cma_send_otp_msg.json",
                    phone: phone,
                    captchaToken: captchaToken
                }, extraData);

                // callback.
                cb = angular.isFunction(cb) ? cb : angular.noop;
                this.postRequest("/h5/cma_send_otp_msg.json", reqData, {
                    dto: this.trySendOtpDto,
                    withCredentials: true
                }).then(cb, cb);
            },
            /**
             * Mock confirm dialog box exec api request while tap confirm.
             * @param  {string} mockResultCode result code.
             */
            testConfirmRequest: function(mockResultCode, sleepSecond) {
                return this.postRequest("/testApi/testConfirmRequest", {
                    mockResultCode: mockResultCode,
                    sleepSecond: sleepSecond
                });
            }
        });
        return new Child();
    };

    // expose service contract.
    app.service('DocService', ['$log', 'httpRequest', DocService]);

})(app);
