(function() {
    function UserService($log, BaseHttpRequest) {

        function Child() {
            // inherits base http request infrustrature.
            BaseHttpRequest.call(this);
            // each service must be defined this key used to flag current request belong to.
            this.logAPIUniqueKey = "[UserService]";
            // 商户app带入，通过加在入口文件的queryString中
            // this.token= '';
            // this.phone= '';
            // this.identityNum= '';
            // this.realName= '';
            //
            // --------------------------------------------------
            //  dtos
            this.getUserInfoDto = function(result) {
                return result;
            };
            this.checkUserInfoDto = function(result) {
                return result;
            };
            this.bindCmaByOldUserDto = function(result) {
                return result;
            };
            this.bindCmaByNewUserDto = function(result) {
                return result;
            };
            this.createPaypassByOtpDto = function(result) {
                return result;
            };
        };

        // inherits prototype methods from httpRequest.
        inherit(Child, BaseHttpRequest);

        // Expose service request apis to consumer.
        angular.extend(Child.prototype, {
            // 根据token获取用户信息
            // {} request token
            getUserInfo: function(paramObj) {
                var reqData = this.getRequestData({
                    operationType: "/h5/cma_get_user_info.json"
                }, paramObj);
                var promise = this.postRequest("/h5/cma_get_user_info.json", reqData, this.getUserInfoDto);
                return promise;
            },
            // 核对用户身份信息
            // @param {object} paramObj required: phone, identityNum, realName, token
            // @return promise
            // 
            /**
             * [checkUserInfo 核对用户身份信息]
             * @param  {[type]} paramObj [description]
             * @return {[type]}          [description]
             */
            checkUserInfo: function(paramObj) {
                var reqData = this.getRequestData({
                    operationType: "/h5/cma_check_user_info.json"
                }, paramObj);
                var promise = this.postRequest("/h5/cma_check_user_info.json", reqData, this.checkUserInfoDto);
                return promise;
            },
            // 老用户开通cma账户流程
            // request {} required: token, phone
            bindCmaByOldUser: function(paramObj) {
                var reqData = this.getRequestData({
                    operationType: "/h5/cma_old_user_open_account.json"
                }, paramObj);
                var promise = this.postRequest("/h5/cma_old_user_open_account.json", reqData, this.bindCmaByOldUserDto);
                return promise;
            },
            // 用户注册并开户
            // request {} required: token, smsCode, phone, identityNum, realName
            bindCmaByNewUser: function(paramObj) {
                var reqData = this.getRequestData({
                    operationType: "/h5/cma_register_and_open_account.json"
                }, paramObj);
                var promise = this.postRequest("/h5/cma_register_and_open_account.json", reqData, this.bindCmaByNewUserDto);
                return promise;
            },
            /**
             * [createPaypassByOtp 通过otp设置支付密码]
             * @param  {[]} paramObj [required: payPassword, otpSessionId]
             * @return {[type]}          [description]
             */
            createPaypass: function(paramObj) {
                var reqData = this.getRequestData({
                    operationType: "/h5/create_real_name_pay_pwd.json",
                    appId: "100001",
                    payPasswdStrength: "C"
                }, paramObj);
                var promise = this.postRequest("/h5/create_real_name_pay_pwd.json", reqData, this.createPaypassByOtpDto);
                return promise;
            }
        });
        return new Child();
    };

    // expose service contract.
    app.service('UserService', ['$log', 'CMAHttpRequest', UserService]);
})(app);
