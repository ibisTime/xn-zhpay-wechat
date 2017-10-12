define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/validate',
    'app/module/loading',
], function (base, Ajax, Validate, loading) {
    var tmpl = __inline("index.html");
    var defaultOpt = {};
    var userId = sessionStorage.getItem("user") || "";
    var firstAdd = true;

    function initData(){
        loading.createLoading();
        $("#userId").val(defaultOpt.userId);
        // 添加银行卡
        if(!defaultOpt.code){
            return getAddInitData();
        }
        // 修改银行卡
        return getEditInitData();
    }
    // 获取添加银行卡初始化数据
    function getAddInitData() {
        return $.when(
            Ajax.get("802116"),
            getBankCode()
        ).then(function (res, res1) {
        	
            if (res.success) {
            	var data = res.data
	            loading.hideLoading();
	            data.realName && $("#realName").val(data.realName);
	            data.mobile && $("#bindMobile").val(data.mobile);
            } else {
            	base.showMsg(res.msg || res1.msg);
            }
        })
    }
    // 获取修改银行卡初始化数据
    function getEditInitData() {
        return $.when(
            getBankCard(),
            getBankCode()
        ).then(function (res, res1) {
        	if (res.success && res1.success ) {
            	var data = res.data
	            loading.hideLoading();
	            $("#bankName").val(data.bankName).trigger("change");
	            $("#realName").val(data.realName);
	            $("#bindMobile").val(data.bindMobile);
	            $("#bankcardNumber").val(data.bankcardNumber);
	            $("#payCardInfo").val(data.payCardInfo);
            } else {
            	base.showMsg(res.msg || res1.msg);
            }
        })
    }
    // 添加银行卡
    function addBankCard(){
        loading.createLoading("保存中...");
        var param = $("#addOrEditBankCardForm").serializeObject();
        param.systemCode = SYSTEM_CODE
        
        Ajax.post("802010", {
        	json:param
        }).then(function(res){
            loading.hideLoading();
        	if(res.success){
                ModuleObj.hideCont(defaultOpt.success);
            }else{
        		base.showMsg(res.msg || "修改银行卡失败");
        	}
        }, function(msg){
            base.showMsg(msg || "添加银行卡失败");
        });
    }
    // 修改银行卡
    function editBankCard() {
        loading.createLoading("保存中...");
        var param = $("#addOrEditBankCardForm").serializeObject();
        param.code = defaultOpt.code;
        param.status = 1;
        param.systemCode = SYSTEM_CODE;
        Ajax.post("802012", {
        	json:param
        }).then(function(res){
    		loading.hideLoading();
        	if(res.success){
            	ModuleObj.hideCont(defaultOpt.success);
        	}else{
        		base.showMsg(res.msg || "修改银行卡失败");
        	}
        }, function(msg){
        	base.showMsg(msg || "修改银行卡失败");
        });
    }

    // 根据code获取银行卡详情
    function getBankCard(){
        return Ajax.get('802017',{
        	code:defaultOpt.code
        });
    }

    // 获取银行select列表
    function getBankCode(){
        return Ajax.get("802116").then(function(res){
        	var data = res.data
            var html = "";
            data.forEach(function(item){
                html += '<option value="'+item.bankName+'" code="'+item.bankCode+'">'+item.bankName+'</option>';
            });
            $("#bankName").html(html).trigger("change");
        });
    }
    var ModuleObj = {
        addCont: function (option) {
            option = option || {};
            defaultOpt = $.extend(defaultOpt, option);
            if(!this.hasCont()){
                var temp = $(tmpl);
                $("body").append(tmpl);
            }
            var wrap = $("#addOrEditBankCardContainer");
            defaultOpt.title && wrap.find(".right-left-cont-title-name").text(defaultOpt.title);
            var that = this;
            if(firstAdd){
                var _form = $("#addOrEditBankCardForm");
                wrap.on("click", ".right-left-cont-back", function(){
                    ModuleObj.hideCont(defaultOpt.hideFn);
                });
                wrap.find(".right-left-cont-title")
                    .on("touchmove", function(e){
                        e.preventDefault();
                    });
                $("#addOrEditBankCardBtn")
                    .on("click", function(){
                        if(_form.valid()){
                            if(defaultOpt.code){
                                editBankCard();
                            }else{
                                addBankCard();
                            }
                        }
                    });
                _form.validate({
                    'rules': {
                        realName: {
                            required: true,
                            isNotFace: true,
                            maxlength: 16
                        },
                        bankName: {
                            required: true
                        },
                        payCardInfo: {
                            required: true,
                            isNotFace: true,
                            maxlength: 255
                        },
                        bindMobile: {
                            required: true,
                            mobile: true
                        },
                        bankcardNumber: {
                            required: true,
                            bankCard: true
                        }
                    },
                    onkeyup: false
                });
                $("#bankName").on("change", function(){
                    $("#bankCode").val($("#bankName option:selected").attr("code"));
                });
            }

            firstAdd = false;
            return this;
        },
        hasCont: function(){
            return !!$("#addOrEditBankCardContainer").length;
        },
        showCont: function (option){
            if(this.hasCont()){
            	option = option || {};
                if(option.code) {
                    defaultOpt.code = option.code;
                    $("#addOrEditBankCardContainer").find(".right-left-cont-title-name").text("修改银行卡");
                } else {
                    defaultOpt.code = "";
                    $("#addOrEditBankCardContainer").find(".right-left-cont-title-name").text("绑定银行卡");
                }
                initData().then(function(){
                    ModuleObj._showCont();
                });
            }
            return this;
        },
        _showCont: function(){
            var wrap = $("#addOrEditBankCardContainer");
            wrap.show().animate({
                left: 0
            }, 200, function(){
                defaultOpt.showFun && defaultOpt.showFun();
            });
        },
        hideCont: function (func){
            if(this.hasCont()){
                var wrap = $("#addOrEditBankCardContainer");
                wrap.animate({
                    left: "100%"
                }, 200, function () {
                    wrap.hide();
                    func && func($("#bankcardNumber").val(), $("#bankName").find("option:selected").text());
                    $("#realName").val("");
                    $("#payCardInfo").val("");
                    $("#bankcardNumber").val("");
                    wrap.find("label.error").remove();
                });
            }
            return this;
        }
    }
    return ModuleObj;
});
