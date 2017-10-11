define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/addOrEditBankCard',
    'app/module/validate'
], function(base, Ajax, addOrEditBankCard, Validate) {
    var remainAmount = 0, rate;
    var currencyType = 'LBB'
    init();
    function init() {
        base.showLoading();
        $.when(
            getBankCardList(),
            getRules(),
            getAccount()
        ).then(function() {
            base.hideLoading();
            addListener();
        });
    }
    // 获取提现规则
    function getRules() {
        return Ajax.get('802029',{
        	type: 'C_LBB',
    		companyCode: COMPANY_CODE,
    		systemCode: SYSTEM_CODE
        }).then(function(res) {
        	if(res.success){
        		var data = res.data
            	$("#rechargeTimes").text(data.USER_MONTIMES);
                $("#times").text(data.USER_QXBS);
                $("#maxAmount").text(data.USER_QXDBZDJE);
                rate = +data.USER_QXFL;
                $("#qxfl").text(data.USER_QXFL*100)
        	}else{
        		base.showMsg(res.msg)
        	}
        });
    }
    // 获取银行卡列表
    function getBankCardList(){
         return Ajax.get('802016',{systemCode: SYSTEM_CODE}).then(function(res){
            	if(res.success){
            		var data = res.data
            		base.hideLoading();
	                if(data.length){
	                    var html = "";
	                    data.forEach(function(item){
	                        html += '<option data-name="'+item.bankName+'" value="'+item.bankcardNumber+'">'+item.bankcardNumber+'</option>';
	                    });
	                    $("#payCardNo").html(html);
	                }else{
	                    doNoBankCard();
	                }
            	}else{
	        		base.showMsg(res.msg)
	        	}
            });
    }
    // 用户还未绑定银行卡的处理方式
    function doNoBankCard() {
        var _payCardNo = $("#payCardNo"),
            _noCard = $("#noCard");
        addOrEditBankCard.addCont({
            userId: base.getUserId(),
            success: function(bankcardNumber, bankName) {
                _payCardNo.html(`<option data-name="${bankName}" value="${bankcardNumber}">${bankcardNumber}</option>`)
                    .valid();
                _noCard.addClass("hidden");
            }
        });
        _noCard.removeClass("hidden").on("click", function() {
            addOrEditBankCard.showCont();
        });
    }
    // 获取用户账户
    function getAccount() {
        return Ajax.get('802503',{userId: base.getUserId()})
            .then(function(res) {
            	if(res.success){
            		var data = res.data
		            data.forEach((account) => {
		                if(account.currency == currencyType){
		                    $("#accountNumber").val(account.accountNumber);
		                    remainAmount = +account.amount;
		                    $("#remainAmount").text(base.formatMoney(account.amount));
		                }
		            });
		        }else{
	        		base.showMsg(res.msg)
	        	}
            });
    }
    function addListener() {
        var _withDrawForm = $("#withDrawForm");
        _withDrawForm.validate({
            'rules': {
                amount: {
                    required: true,
                    ltR: true,
                    amount: true
                },
                payCardNo: {
                    required: true
                },
                tradePwd: {
                    required: true,
                    isNotFace: true,
                    minlength: 6,
                    maxlength: 20
                }
            },
            onkeyup: false
        });
        // 提现
        $("#submitBtn").click(function() {
            if (_withDrawForm.valid()) {
                base.showLoading();
                doWithDraw(_withDrawForm.serializeObject());
            }
        });
        // 计算手续费
        $("#amount").on("keyup", function() {
            var value = this.value, amount = 0;
            if($.isNumeric(value)) {
                amount = value * 1000 * rate;
            }
            $("#fee").text(base.formatMoney(amount) + "元");
        });
        $.validator.addMethod("ltR", function(value, element) {
            value = +value;
            if(value * 1000 > remainAmount) {
                return false;
            }
            return true;
        }, '必须小于可用余额');
        
        $("#withdrawRecord").click(function(){
        	location.href='./withdraw-record.html?accountNumber='+$("#accountNumber").val()
        })
        
    }
    // 提现
    function doWithDraw(param) {
        param.payCardInfo = $("#payCardNo").find("option:selected").attr("data-name");
        param.amount = param.amount * 1000;
        param.applyNote = "前端用户提现";
        param.applyUser = base.getUserId()
        Ajax.post("802750", {
        	json:param
        }).then(function(res) {
        	if(res.success){
        		base.hideLoading();
	            base.showMsg("申请提交成功");
	            setTimeout(function() {
	            	
	          		location.href='./user.html';
	            	
	            }, 700);
        	}else{
        		base.hideLoading();
        		base.showMsg(res.msg,10000)
        	}
            
        });
    }
});
