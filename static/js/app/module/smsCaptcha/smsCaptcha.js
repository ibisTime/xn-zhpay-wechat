define([
    'jquery',
    'app/util/ajax',
    'app/util/dialog'
], function ($, Ajax, dialog) {
    function _showMsg(msg, time) {
        var d = dialog({
            content: msg,
            quickClose: true
        });
        d.show();
        setTimeout(function() {
            d.close().remove();
        }, time || 1500);
    }
    function initSms(opt){
        this.options = $.extend({}, this.defaultOptions, opt);
        var _self = this;
        $("#" + this.options.id).off("click")
            .on("click", function() {
                _self.options.checkInfo() && _self.handleSendVerifiy();
            });
    }
    initSms.prototype.defaultOptions = {
        id: "getVerification",
        mobile: "mobile",
        checkInfo: function () {
            return $("#" + this.options.mobile).valid();
        },
        sendCode: '805904'
    };
    initSms.prototype.handleSendVerifiy = function() {
        var verification = $("#" + this.options.id);
        verification.attr("disabled", "disabled");
        Ajax.post(this.options.sendCode, {
            json: {
                "bizType": this.options.bizType,
                "kind": "f1",
                "mobile": $("#" + this.options.mobile).val(),
    		    "systemCode": SYSTEM_CODE
            }
        }).then(function(response) {
            if (response.success) {
                for (var i = 0; i <= 60; i++) {
                    (function(i) {
                        setTimeout(function() {
                            if (i < 60) {
                                verification.val((60 - i) + "s");
                            } else {
                                verification.val("获取验证码").removeAttr("disabled");
                            }
                        }, 1000 * i);
                    })(i);
                }
            } else {
                _showMsg(response.msg);
                verification.val("获取验证码").removeAttr("disabled");
            }
        }, function() {
            this.options.errorFn && this.options.errorFn();
            _showMsg("验证码获取失败");
            verification.val("获取验证码").removeAttr("disabled");
        });
    }
    return {
        init: function (options) {
            new initSms(options);
        }
    }
});