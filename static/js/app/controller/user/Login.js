define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/util/cookie',
], function(base, Ajax, loading, CookieUtil) {
	var loginFalg = CookieUtil.get("loginFalg")&&CookieUtil.get("loginFalg")=='1'? true : false;//true 记住账号密码 
	
	init();
	
    function init(){
    	addListener();
    	
    	if(loginFalg){
    		$(".rememberInfo").addClass('active')
    		
        	if(CookieUtil.get("mobile")){
        		$(".r-input").siblings(".r-input-placeholder").html(" ");
        		$("#l-tel").val(CookieUtil.get("mobile")||'');
        		$("#l-pwd").val(CookieUtil.get("pwd")||'');
        	}
    	}else{
    		$(".rememberInfo").removeClass('active')
            CookieUtil.del("mobile");
            CookieUtil.del("pwd");
    	}
    	
    }
    
    function addListener() {
    	$(".r-input").focus(function(){
        	$(this).siblings(".r-input-placeholder").html(" ");
        })
        $(".r-input").blur(function(){
        	var txt = $(this).siblings(".r-input-placeholder").attr("data-txt");
        	if($(this).val()==""){
        		$(this).siblings(".r-input-placeholder").html(txt);
        	}
        })
        
        $(".rememberInfo").click(function(){
        	
        	var loginName = $("#l-tel").val();
        	var loginPwd = $("#l-pwd").val();
        	
        	if($(this).hasClass('active')){
        		loginFalg = false;
        		$(this).removeClass('active');
        		
        		CookieUtil.set("loginFalg", '0')
        		
	            CookieUtil.del("mobile");
	            CookieUtil.del("pwd");
        	}else{
        		loginFalg = true;
        		$(this).addClass('active')
        		
        		CookieUtil.set("loginFalg", '1')
        		
	            CookieUtil.set("mobile", loginName);
	            CookieUtil.set("pwd", loginPwd);
        	}
        })
        
        $("#lbtn-sub").click(function(){
        	
        	var loginName = $("#l-tel").val();
        	var loginPwd = $("#l-pwd").val();
        	
        	var param = {
        		loginName: loginName,
        		loginPwd: loginPwd,
        		kind: 'f1',
        		companyCode: COMPANY_CODE,
        		systemCode: SYSTEM_CODE
        	}
        	
        	
        	if(loginName == null || loginName == ""){
        		base.showMsg("请输入手机号码");
        	}else if(loginPwd == null || loginPwd == ""){
        		base.showMsg("请输入密码");
        	}else{
        		if(loginFalg){
		            CookieUtil.set("mobile", loginName);
		            CookieUtil.set("pwd", loginPwd);
        		}
        		Ajax.get("805043", param).then(function(res){
	                base.showLoading()
	                if (res.success) {
	                	base.hideLoading()
	                	$("#l-tel").val('')
	                	$("#l-pwd").val('')
	                	base.setSessionUser(res.data)
	                	location.href = '../user/user.html?timestamp=' + new Date().getTime();
	                }else{
	                	base.hideLoading();
	                	base.showMsg(res.msg)
	                }
	        	});
        	}
        })
    }
});