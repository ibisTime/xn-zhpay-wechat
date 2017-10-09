define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/setTradePwd'
], function(base, Ajax, setTradePwd) {
	var tradepwdFlag = 0;
	var mobile;
	
    init();
    
    function init(){
    	base.showLoading()
    	$.when(
    		getUserInfo(),
    		getAccount()
    	).then(function(){
    		
    		base.hideLoading()
    		addListener()
    	},function(){
    		base.hideLoading()
    	})
    }
    
    //获取用户信息
    function getUserInfo(){
    	return Ajax.get('805056').then(function(res){
    		if(res.success){
    			mobile = res.data.mobile
    			tradepwdFlag = res.data.tradepwdFlag
    			$(".user-top .photo").html('<div style="background-image: url('+base.getAvatar(res.data.userExt?res.data.userExt.photo:'')+');"></div>')
    			$(".user-top .mobile").html(res.data.mobile)
    		}else{
    			base.showMsg(res.msg)
    		}
    	})
    }
    
    //获取用户账户
    function getAccount() {
        return Ajax.get('802503',{userId: base.getUserId()})
            .then((res) => {
            	if(res.success){
            		var data = res.data
		            data.forEach((account) => {
		                if(account.currency == 'LBB'){
		                    $("#LBBAmount").text(base.formatMoney(account.amount));
		                }
		            });
		        }else{
	        		base.showMsg(res.msg)
	        	}
            });
    }
	
	function addListener(){
		setTradePwd.addCont({
			mobile:mobile,
			successUrl:'./withdraw.html'
		})
		$("#withdraw").click(function(){
			if(tradepwdFlag==0&&!tradepwdFlag){
				setTradePwd.showCont()
			}else{
				location.href='./withdraw.html'
			}
		})
	}
});