(function() {
    function AssetService($log, BaseHttpRequest) {
        function Child() {
            // inherits base http request infrustrature.
            BaseHttpRequest.call(this);
            
            // each service must be defined this key used to flag current request belong to.
            this.logAPIUniqueKey = "[AssetService]";
            //
            // --------------------------------------------------
            //  dtos
            this.getHomeDataDto = function(result) {
                return result;
            };
            this.doIncomeDto = function(result) {
                return result;
            };
            this.getBalanceDto = function(result) {
                return result;
            };
            this.doPayDto = function(result) {
                return result;
            };
            this.getTransDetailDto = function(result) {
                return result;
            };
            this.getEarningsDetailDto = function(result) {
                return result;
            };
            this.getModelTypeDto = function(result) {
                return result;
            };
            this.getPayLimitDto = function(result) {
                return result;
            };
        };

        // inherits prototype methods from httpRequest.
        inherit(Child, BaseHttpRequest);

        // Expose service request apis to consumer.
        angular.extend(Child.prototype, {
            // 用户资产首页
            // {} required: null
            getHomeData: function(paramObj) {
                if (typeof paramObj == 'undefined') {
                    paramObj = null;
                };
                var promise = this.postRequest("/h5/cma_asset_overview.json", paramObj, this.getHomeDataDto);
                return promise;
            },
            // 转入
            // {} required: amout, type, setpaypassword
            doIncome: function(paramObj) {
                var reqData = this.getRequestData({
                    operationType: "/h5/cma_transfer_into_acct.json"
                }, paramObj);
                var promise = this.postRequest("/h5/cma_transfer_into_acct.json", reqData, this.doIncomeDto);
                return promise;
            },
            // 获取用户商户余额
            // {} required: null
            getBalance: function(paramObj) {
                if (typeof paramObj == 'undefined') {
                    paramObj = null;
                };
                var promise = this.postRequest("/h5/cma_query_merchant_balance.json", paramObj, this.getBalanceDto);
                return promise;
            },
            // 转出
            // {} required: amout, type, setpaypassword, bankCardNo（转出到银行卡时必须）
            doPay: function(paramObj) {
                var reqData = this.getRequestData({
                    operationType: "/h5/cma_transfer_out_acct.json"
                }, paramObj);
                var promise = this.postRequest("/h5/cma_transfer_out_acct.json", reqData, this.doPayDto);
                return promise;
            },
            // 查询交易明细
            // {} required: pageNum, pageSize
            getTransDetail: function(paramObj) {
                var reqData = this.getRequestData({
                    operationType: "/h5/cma_query_trans_detail.json"
                }, paramObj);
                var promise = this.postRequest("/h5/cma_query_trans_detail.json", reqData, this.getTransDetailDto);
                return promise;
            },
            // 查询累计收益明细
            // {} required: pageNum, pageSize
            getEarningsDetail: function(paramObj) {
                var reqData = this.getRequestData({
                    operationType: "/h5/cma_query_history_gains.json"
                }, paramObj);
                var promise = this.postRequest("/h5/cma_query_history_gains.json", reqData, this.getEarningsDetailDto);
                return promise;
            },
            // 获取转出的最大限额
            // {} required: null
            getPayLimit: function(paramObj) {
                var reqData = this.getRequestData({
                    operationType: "/h5/cma_query_transfer_out_limit.json"
                }, paramObj);
                var promise = this.postRequest("/h5/cma_query_transfer_out_limit.json", reqData, this.getPayLimitDto);
                return promise;
            },

            // 获取转入转出的类型，余额/银行卡
            // {} required: null
            getModelType: function(paramObj) {
                var reqData = this.getRequestData({
                    operationType: "/h5/cma_query_trans_model.json"
                }, paramObj);
                var promise = this.postRequest("/h5/cma_query_trans_model.json", reqData, this.getModelTypeDto);
                return promise;
            }
        });
        return new Child();
    };

    // expose service contract.
    app.service('AssetService', ['$log', 'CMAHttpRequest', AssetService]);
})(app);
