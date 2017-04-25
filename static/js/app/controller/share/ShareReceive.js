define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
	var code = base.getUrlParam("code");
	var userReferee = base.getUrlParam("userReferee");
	var iosUrl ;
	var androidUrl ;

    init();

    function init() {
        addListener();
    }

    function addListener() {
		
		//领取红包
		$("#bBtn-receive").click(function(){
			
			
			var userTel = $("#b-tel").val()
			var userPwd = $("#b-pwd").val();
			
			if(userTel == null || userTel == ""){
        		base.showMsg("请输入钱包账号");
        	}else if(userPwd == null || userPwd == ""){
        		base.showMsg("请输入登录密码");
        	}else{
        		Ajax.get("805043",{
        			"loginName": userTel,
					"loginPwd": userPwd,
					"kind": "f1",
					"systemCode":SYSTEM_CODE
        		}).then(function(res) {
	                if (res.success) {
	                	
	                	var userId = res.data.userId;
	                	Ajax.get("615131",{
		        			"code": code,
		    				"userId": userId,
							"systemCode":SYSTEM_CODE
		        		}).then(function(res1) {
			                if (res1.success) {
			                	base.confirm("领取成功，我要使用!")
								.then(function(){
									base.getLocation();//跳转
								},function(){});
			                } else {
			                	base.showMsg(res1.msg);
			                }
			            }, function() {
			                base.showMsg("领取失败");
			            });
			            
	                } else {
	                	base.showMsg(res.msg);
	                }
	            }, function() {
	                base.showMsg("领取失败");
	            });
        		
        		
        	}

			
			
		});
		
		//注册
		$("#bBtn-register").click(function(){
			location.href = "../user/register.html?status=1&code="+code+"&userReferee="+userReferee;
		});
		
    }
});