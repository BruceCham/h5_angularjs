(function() {
    //privider public password encriptor service interactive with MTP.
    function EncryptService($log, BaseHttpRequest, encryptor) {
        function Child() {
            // inherits base http request infrustrature.
            BaseHttpRequest.call(this);

            // each service must be defined this key used to flag current request belong to.
            this.logAPIUniqueKey = "[EncryptService]";
            // 加密用户设置的密码  hotfix for p1 service, manaully add appid:"100001", clientId:"e90_h5_apply"
            this.encryptorPwdDto = function(result) {
                var data = result.data;
                if (result.code == "1000") {
                    var ts = data.timestamp;
                    var aPK = data.controllerPublicKey;
                    var hPK = data.securityPublicKey;
                    if (!this.password) {
                        $log.warn("EncryptService-> password is required!");
                        result.encryptedPwd = "";
                    } else {
                        var encryptedPwd = encryptor.encryptorPassword(ts, aPK, hPK, this.password);
                        result.encryptedPwd = encryptedPwd;
                    }
                }
                $log.debug("Encrypted password result: ", result);
                return result;
            };
        };
        // inherits prototype methods from httpRequest.
        inherit(Child, BaseHttpRequest);

        angular.extend(Child.prototype, {
            // 加密用户设置的密码  hotfix for p1 service, manaully add appid:"100001", clientId:"e90_h5_apply"
            encryptPassword: function(password) {
                this.password = password;
                var reqData = this.getRequestData({
                    operationType: "/p1/op_query_public_key.json",
                    appId: "100001" //for p1 service, manaully add appid:"100001"
                });
                return this.postRequest("/p1/op_query_public_key.json", reqData, this.encryptorPwdDto);
            }
        });
        return new Child();
    };

    // expose service contract.
    app.service('EncryptService', ['$log', 'CMAHttpRequest', 'encryptor', EncryptService]);
})(app);
