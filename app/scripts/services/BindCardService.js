(function() {

    /**
     * 绑卡相关页面的服务
     * DOC URL
     * http://192.168.1.158:8080/docfull/index.htm
     */
    function BindCardService($log, BaseHttpRequest) {

        function Child() {
            // inherits base http request infrustrature.
            BaseHttpRequest.call(this);

             // each service must be defined this key used to flag current request belong to.
            this.logAPIUniqueKey = "[BindCardService]";

            //查询当前用户绑定的借记卡信息 DTO
            this.queryUserBoundBankcardInfoDto = function(result) {
                var data = result.data;
                if (result.code == "1000") {
                    result.data = {
                        sessionId: data.sessionId,
                        //[{
                        //  bankId:在服务器端唯一标识一家银行,
                        //  bankName:中文的银行信息描述,
                        //  bankMark:银行标识,客户端需要通过该标识来显示银行的图标等信息
                        //  bankCardId:银行卡编号,
                        //  bankCardType:银行卡类型,
                        //  bankCardNum:银行卡号的后六位，当中两位使用”*”表示,
                        //  fastPayFlag: P-签约中 Y-已签约 N-已解约 ,在绑卡接口的应答不存在，其他接口存在
                        //}]
                        //List<BankCardInfo>
                        bankCardInfoList: data.bankCardInfoList
                    };
                }
                return result;
            };

            //查询当前支持的借记卡信息列表 DTO
            this.querySupportedBandListInfoDto = function(result) {
                var data = result.data;
                if (result.code == "1000") {
                    result.data = {
                        //客户端与服务器端的通讯token
                        sessionId: data.sessionId,
                        // 借记卡银行支持列表List<BankInfo>{bankName:"",bankCode:""}
                        debitSupportBankList: data.debitSupportBankList

                        //信用卡银行支持列表
                        //List<BankInfo>{bankName:"",bankCode:""}
                        // creditSupportBankList: data.creditSupportBankList,
                    };
                }
                return result;
            };

            //根据银行卡号查询卡片对应银行的信息
            this.queryBankInfoDto = function(result) {
                var data = result.data;
                if (result.code == "1000") {
                    result.data = {
                        //客户端与服务器端的通讯token
                        sessionId: data.sessionId,
                        //是否为借贷合一卡
                        cardTypeisDCAll: data.cardTypeisDCAll,
                        //支持的银行卡Bin信息
                        // {
                        //   bankMark: 银行标识
                        //   bankName: 所属银行名称,
                        //   bankId: 银行ID,
                        //   bankCardType: 银行卡类型,D：借记卡,C：贷记卡（信用卡）,P：存折,
                        //   openOnlinePayStatus: 是否开通银联在线,op_query_bank_card_info协议，1:开通,0:未开通,
                        //   signTransNo: 签约流水号, 添加于20141127,
                        //   
                        //    1-旧版流程:
                        //       1.1 绑卡老流程
                        //       /h5/op_apply_sms_code_with_session.json
                        //       /h5/op_bind_bank_card.json
                        //    2-新版流程
                        //       2.1绑卡新流程
                        //       /h5/op_check_user_info.json
                        //       /h5/op_bind_bank_card_v2.json
                        //   version: 签约流程版本1|2
                        //   
                        //     `CARD_TYPE:卡类型 
                        //     `CARD_NO:卡号
                        //     `CARD_NAME:持卡人姓名
                        //     `IDENTITY_TYPE : 证件类型
                        //     `IDENTITY_CODE:证件号码
                        //     `CVV2 : CVV2
                        //     `EXPIRE_DATE:信用卡有效期
                        //     `MOBILE:银行预留手机号 
                        //    paramSpec: 签约参数说明
                        // }
                        cardBinList: data.cardBinList,

                        //银联在线URL
                        unionpayURL: data.unionpayURL
                    };
                }
                return result;
            };

            // 绑卡新/老流程queryBankInfoDto->version =1,2,用于绑定银行卡信息同时验证短信验证码
            // 绑卡新/老流程最后的一步
            this.bindUserBankCardInfoDto = function(result) {
                var data = result.data;
                if (result.code == "1000") {
                    result.data = {
                        sessionId: data.sessionId,
                        //{
                        //  bankId:在服务器端唯一标识一家银行,
                        //  bankName:中文的银行信息描述,
                        //  bankMark:银行标识,客户端需要通过该标识来显示银行的图标等信息
                        //  bankCardId:银行卡编号,
                        //  bankCardType:银行卡类型,
                        //  bankCardNum:银行卡号的后六位，当中两位使用”*”表示,
                        //  fastPayFlag: P-签约中 Y-已签约 N-已解约 ,在绑卡接口的应答不存在，其他接口存在
                        //}
                        bankCardInfo: data.bankCardInfo,
                        //证件类型
                        idCardType: data.idCardType,
                        //身份证号
                        idCardNo: data.idCardNo,
                        //用户信息,第一次绑定银行卡时出现
                        //{ 
                        //  userId:"会员编号",在服务器端为用户编号，系统唯一
                        //  account:"账户编码",在服务器端为用户资金账户的标识
                        //  phoneNum:"手机号",
                        //  realName:"真实姓名",真是姓名
                        //  accountType:"账户类型",1.普通账户,2.公共
                        //  accountStatus:"会员状态",1.注册中的状态（头像未上传）,2. 激活状态,3. 冻结状态,4. 注销状态,5. 未注册状态.
                        //  headImageUrl:"下载资源的地址",如果用户还没有上传头像则该字段将不会返回
                        //  imageType:"图片类型",1.JPG,2.GIF,3.PNG,如果用户还没有上传头像则该字段将不会返回
                        //  authLevel:"实名级别",C:表示弱实名,B:表示中实名
                        //  createTime:"会员注册时间",用户注册时间
                        //  loginPasswdStrength:"会员登录密码强度",登录密码强度。A: 强,B: 中,C: 弱,仅当是当前用户才返回
                        //  payPasswdStrength:"会员支付密码强度",A: 强,B: 中,C: 弱,仅当是当前用户才返回
                        //  regChannel:"注册渠道",
                        //  uid:"用户18位长度的uid",
                        //  
                        //}
                        userInfo: data.userInfo,
                        //用户验证序列号
                        serialNumber: data.serialNumber
                    };
                }
                return result;
            };
        };

        // inherits prototype methods from httpRequest.
        inherit(Child, BaseHttpRequest);

        // Expose service request apis to consumer.
        angular.extend(Child.prototype, {

            /**
             * 查询当前用户绑定的借记卡信息
             * optional: 按需要通过extraData 来配置.
             *     sessionId:会话标识
             * @return {promise}
             */
            queryUserBoundBankcardInfo: function(extraData) {
                var reqData = this.getRequestData({
                    operationType: "/h5/cma_query_bind_bank_card.json"
                }, extraData);

                return this.postRequest("/h5/cma_query_bind_bank_card.json", reqData, this.queryUserBoundBankcardInfoDto);
            },
            /**
             * 查询当前支持的借记卡信息列表
             * optional: 按需要通过extraData 来配置.
             *     appVersion:"应用版本号""
             *     sessionId:"会话编号"
             *
             * @param {number} queryType 0: 全部, 1:仅借记卡
             * @return {promise}
             */
            querySupportedBandListInfo: function(queryType, extraData) {
                var reqData = this.getRequestData({
                    operationType: "/h5/op_query_support_bank_info.json",
                    queryType: queryType
                }, extraData);

                return this.postRequest("/h5/op_query_support_bank_info.json", reqData, this.querySupportedBandListInfoDto);
            },
            /**
             * 在绑定银行卡时,需要提前根据银行卡号查询当前银行卡相关信息，
             * 支持借贷合一卡，目前CMA 只支持借记卡.
             * optional : 按需要通过extraData 来配置.
             *     appVersion
             *     sessionId
             *     transId(不用填)
             *
             * appId, clientId 全局提供
             * @param {string} bankCardNo     银行卡号码 必选
             * @param {number} queryScene     0–表示不关注业务场景，只要有则返回。1–快捷签约,2–充值,3–提现, 4-鉴权, 5-仅借记卡签约快捷,目前我们只用借记卡
             * @param {string} supportNewSign
             * @return {promise}
             */
            queryBankInfo: function(bankCardNo, queryScene, supportNewSign, extraData) {
                var reqData = this.getRequestData({
                    operationType: "/h5/op_query_bank_card_info_v2.json",
                    bankCardNo: bankCardNo,
                    queryScene: queryScene,
                    supportNewSign: supportNewSign
                }, extraData);

                return this.postRequest("/h5/op_query_bank_card_info_v2.json", reqData, this.queryBankInfoDto);
            },

            /**
             * 绑卡老流程queryBankInfoDto->version =1
             * 绑定银行卡信息,用于绑定银行卡信息同时验证短信验证码
             * @param  {number} bankCardNo 银行卡卡号
             * @param  {string} smsCode    短信验证码
             * @param  {object} extraData 可选，如果我们有多个需要传递的可选参数，则通过此接口传送
             *         realName:真实姓名(当为非实名用户时必须)
             *         idCardType:证件类型(1.表示身份证,当为非实名用户时必须)
             *         idCardNo:证件号码(当为非实名用户时必须)
             *         bankCardType:银行卡类型(支持借贷合一卡的客户端需要上送该字段)
             *         agreements:List<CustomerAgreement>[{name,version}]用户同意的协议列表
             *
             * @return {promise}
             */
            bindUserBankCardInfoV1: function(bankCardNo, smsCode, extraData) {
                var reqData = this.getRequestData({
                    operationType: "/h5/op_bind_bank_card.json",
                    bankCardNo: bankCardNo,
                    smsCode: smsCode
                }, extraData);

                return this.postRequest("/h5/op_bind_bank_card.json", reqData, this.bindUserBankCardInfoDto);
            },
            bindUserBankCardInfoV2: function(signTransNo, smsCode, extraData) {
                var reqData = this.getRequestData({
                    operationType: "/h5/op_bind_bank_card_v2.json",
                    signTransNo: signTransNo,
                    smsCode: smsCode
                }, extraData);

                return this.postRequest("/h5/op_bind_bank_card_v2.json", reqData, this.bindUserBankCardInfoDto);
            }
        });

        return new Child();
    };

    // expose service contract.
    app.service('BindCardService', ['$log', 'CMAHttpRequest', BindCardService]);

})(app);
