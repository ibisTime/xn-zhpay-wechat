define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/setTradePwd',
	'app/module/validate',
], function(base, Ajax, setTradePwd, Validate) {
	var fromAccountNumber ;
    var tradepwdFlag = 0, mobile,
    	distRes = [];

    init();

    function init() {
        base.showLoading();
        $.when(
        	getMaxAmount(),
            getAccount()
        ).then(function(){
        	addListener();
        	base.hideLoading();
        },function(){
        	addListener();
        	base.hideLoading();
        });
    }
    
    // 获取账户信息
    function getAccount() {
    	return Ajax.get('802503')
            .then(function (res){
            	if(res.success){
            		var data = res.data
		            data.forEach(function(account) {
		                if(account.currency == 'LBB'){
		                    $("#remain").text(base.formatMoney(account.amount));
		                    fromAccountNumber = account.accountNumber
		                }
		            });
		            
		        }else{
	        		base.showMsg(res.msg)
	        	}
            });
    }
    
    // 获取账户信息
    function getMaxAmount() {
    	return Ajax.get('802029',{
    			type:'TR',
				companyCode: COMPANY_CODE,
				systemCode: SYSTEM_CODE,
    		}).then(function (res){
            	if(res.success){
            		var data = res.data
                    $("#amount").attr('placeholder','转账金额为'+data.TRANS_AMOUNT_BS+'的倍数');
		        }else{
	        		base.showMsg(res.msg)
	        	}
            });
    }
    
    //转账
    function doTransferAccounts(params){
    	params.fromAccountNumber = fromAccountNumber;
    	params.amount = params.amount*1000
        Ajax.post("802419", {
        	json:params
        }).then(function(res) {
        	if(res.success){
        		base.hideLoading();
	            base.showMsg("申请提交成功");
	            setTimeout(function() {
	            	
	          		location.replace('./user.html?timestamp=' + new Date().getTime())
	            	
	            }, 700);
        	}else{
        		base.hideLoading();
        		base.showMsg(res.msg,1000)
        	}
            
        });
    }
    
    function addListener() {
    	var transferAccountsForm = $("#transferAccounts-form");
        transferAccountsForm.validate({
            'rules': {
                amount: {
                    required: true,
                    amount: true
                },
                toMobile: {
                    required: true,
                    mobile: true
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
            if (transferAccountsForm.valid()) {
                base.showLoading();
                doTransferAccounts(transferAccountsForm.serializeObject());
            }
        });
        
        
    }
});
