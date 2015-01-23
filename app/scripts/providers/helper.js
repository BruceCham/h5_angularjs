app.factory("helper", ["$log", "$window", "localStorageCache", "cacheKeyConst",
    function($log, $window, localStorageCache, cacheKeyConst) {
        var merchantInfoFactoryInstance = localStorageCache(cacheKeyConst.factories["MERCHANT_INFO_FACTORY"]);
        var userInfoFactoryInstance = localStorageCache(cacheKeyConst.factories["USER_INFO_FACTORY"]);
        var MERCHANT_DATA = cacheKeyConst.items["MERCHANT_DATA"];
        var USER_DATA = cacheKeyConst.items["USER_DATA"];
        return {
            amtToArr: function(number, formatBit) {
                var amtArr = new Array();
                if (number && !isNaN(number)) {
                    amtArr = number.toFixed(formatBit).split('.');
                    amtArr[0] = amtArr[0] + ".";
                } else {
                    amtArr[0] = "0.";
                    amtArr[1] = "00";
                }
                return amtArr;
            },
            formatAmount: function(number) {
                var amtArr = new Array();
                if (isNaN(number)) {
                    amtArr[0] = "0.";
                    amtArr[1] = "00";
                    return amtArr;
                }
                number = parseFloat((number + "").replace(/[^\d\.-]/g, "")).toFixed(2) + "";
                var l = number.split(".")[0].split("").reverse(),
                    r = number.split(".")[1],
                    i, t = "";
                for (i = 0; i < l.length; i++) {
                    t += l[i] + (((i + 1) % 3 == 0 && (i + 1) != l.length) ? "," : "");
                }
                amtArr = (t.split("").reverse().join("") + "." + r).split(".");
                if (amtArr.length > 0) {
                    amtArr[0] = amtArr[0] + ".";
                }
                return amtArr;
            },
            numAdd: function(num1, num2) { //为防止精度问题，以下四个函数是js计算加减乘除
                var baseNum, baseNum1, baseNum2;
                try {
                    baseNum1 = num1.toString().split(".")[1].length;
                } catch (e) {
                    baseNum1 = 0;
                }
                try {
                    baseNum2 = num2.toString().split(".")[1].length;
                } catch (e) {
                    baseNum2 = 0;
                }
                baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
                return (num1 * baseNum + num2 * baseNum) / baseNum;
            },
            numSub: function(num1, num2) { //减法
                var baseNum, baseNum1, baseNum2;
                var precision;
                try {
                    baseNum1 = num1.toString().split(".")[1].length;
                } catch (e) {
                    baseNum1 = 0;
                }
                try {
                    baseNum2 = num2.toString().split(".")[1].length;
                } catch (e) {
                    baseNum2 = 0;
                }
                baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
                precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
                return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
            },
            numMulti: function(num1, num2) { //乘法
                var baseNum = 0;
                try {
                    baseNum += num1.toString().split(".")[1].length;
                } catch (e) {}
                try {
                    baseNum += num2.toString().split(".")[1].length;
                } catch (e) {}
                return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
            },
            numDiv: function(num1, num2) { //除法
                var baseNum1 = 0,
                    baseNum2 = 0;
                var baseNum3, baseNum4;
                try {
                    baseNum1 = num1.toString().split(".")[1].length;
                } catch (e) {
                    baseNum1 = 0;
                }
                try {
                    baseNum2 = num2.toString().split(".")[1].length;
                } catch (e) {
                    baseNum2 = 0;
                }
                baseNum3 = Number(num1.toString().replace(".", ""));
                baseNum4 = Number(num2.toString().replace(".", ""));
                return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1);
            },
            /**
             * [getMaskedString description]
             * @param  {string} str 需转换字符串
             * @param  {number} startLen 开头保留字符串长度
             * @param  {number} tailLen 末尾保留字符串长度
             * @param  {string} maskSign 替换符号
             * @return {strign}
             */
            getMaskedString: function(str, startLen, tailLen, maskSign) {
                var argsLen = arguments.length;
                switch (argsLen) {
                    case 0:
                        str = "";
                        startLen = 0;
                        tailLen = 0;
                        break;
                    case 1:
                        startLen = 0;
                        tailLen = 0;
                        break;
                    case 2:
                        tailLen = 0;
                        break;
                }
                if (!str) {
                    return "";
                } else {
                    str = str.toString();
                }
                var len = str.length;
                var sum = startLen + tailLen;
                if (sum >= len) {
                    return str;
                }
                return str.substr(0, startLen) + (str.substr(startLen, len - sum)).replace(/./gi, maskSign || '*') + str.substr(len - tailLen);
            },
            //用户名掩码
            getMaskedUserName: function(str, maskSign) {
                var name = str.replace(/\s/g, ""),
                    sign = maskSign ? maskSign : "*";
                if (name.length >= 2) {
                    name = this.getMaskedString(name, 0, 1, sign);
                }
                return name;
            },
            // 缓存商户配置信息
            setMerchantInfo: function(merchantInfo) {
                var oldInfo = this.getMerchantInfo() || {};
                angular.extend(oldInfo, merchantInfo);
                // cache to localstorage.
                merchantInfoFactoryInstance.put(MERCHANT_DATA, oldInfo);
                return merchantInfo;
            },
            // 读取商户配置信息
            getMerchantInfo: function(param) {
                var merchantInfo = merchantInfoFactoryInstance.get(MERCHANT_DATA);
                if (merchantInfo) {
                    if (angular.isString(param)) {
                        return merchantInfo[param];
                    } else if (angular.isArray(param)) {
                        var returnMerchantInfo = {};
                        for (var i = 0; i < param.length; i++) {
                            if (merchantInfo[param[i]]) {
                                returnMerchantInfo[param[i]] = merchantInfo[param[i]];
                            };
                        }
                        return returnMerchantInfo;
                    } else {
                        return merchantInfo;
                    }
                } else {
                    $log.error("can't find merchant info...");
                }
            },
            // 缓存当前用户信息
            setUserInfo: function(userInfo) {
                var oldInfo = this.getUserInfo() || {};
                angular.extend(oldInfo, userInfo);
                userInfoFactoryInstance.put(USER_DATA, oldInfo);
                return userInfo;
            },
            // 获取当前用户信息
            getUserInfo: function(param, isFullEqual) {
                var userInfo = userInfoFactoryInstance.get(USER_DATA);
                if (userInfo) {
                    if (angular.isString(param)) {
                        if (typeof userInfo[param] != "undefined") {
                            return userInfo[param];
                        } else if (!isFullEqual && typeof userInfo["origin_" + param] != "undefined") {
                            return userInfo[param];
                        };
                    } else if (angular.isArray(param)) {
                        var returnUserInfo = {};
                        for (var i = 0; i < param.length; i++) {
                            if (typeof userInfo[param[i]] != "undefined") {
                                returnUserInfo[param[i]] = userInfo[param[i]];
                            } else if (!isFullEqual && typeof userInfo["origin_" + param[i]] != "undefined") {
                                returnUserInfo[param[i]] = userInfo["origin_" + param[i]];
                            };
                        }
                        return returnUserInfo;
                    } else {
                        return userInfo;
                    }
                } else {
                    $log.error("can't find current user info...");
                }
            },

            stringToDate: function(DateStr) {
                var converted = Date.parse(DateStr);
                var myDate = new Date(converted);
                if (isNaN(myDate)) {
                    var YYYY = DateStr.substring(0, 4);
                    var MM_ = DateStr.substring(4, 6);
                    var DD = DateStr.substring(6, 8);
                    var MM = parseInt(MM_) - 1;
                    myDate = new Date(YYYY, MM, DD);
                }
                return myDate;
            },

            getMonAndDay: function(DateStr) {
                var MM = DateStr.substring(4, 6);
                var DD = DateStr.substring(6, 8);
                return MM+"."+DD;
            },

            //拼接月日年+时分秒， 格式为： YYYY.MM.DD HH:MM
            dateFormat: function(dateStr1, dateStr2) {
                var YYYY = dateStr1.substring(0, 4);
                var MM = dateStr1.substring(4, 6);
                var DD = dateStr1.substring(6, 8);
                var HH = dateStr2.substring(0, 2);
                var min = dateStr2.substring(2, 4);
                var ss = dateStr2.substring(4, 6);
                var DateStr1 = new Array(YYYY, MM, DD).join(".");
                var DateStr2 = new Array(HH, min).join(":");
                return new Array(DateStr1, DateStr2).join(" ");
            },

            getWeekDay: function(DD) {
                switch (DD) {
                    case 0:
                        return "周日";
                        break;
                    case 1:
                        return "周一";
                        break;
                    case 2:
                        return "周二";
                        break;
                    case 3:
                        return "周三";
                        break;
                    case 4:
                        return "周四";
                        break;
                    case 5:
                        return "周五";
                        break;
                    case 6:
                        return "周六";
                        break;
                    default:
                        return "";
                        break;
                }
            },

            //返回app
            returnApp: function() {
                var returnUrl = this.getMerchantInfo('returnUrl');
                if (returnUrl) {
                    location.href = returnUrl;
                };
                return false;
            }
        };
    }
]);