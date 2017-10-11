define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
], function(base, Ajax,loading) {
	
	init();
	
    function init(){
    	addListener();
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
        		base.getUserLogin(param).then(function(res){
	                base.showLoading()
	                if (res.success) {
	                	base.hideLoading()
	                	$("#l-tel").val('')
	                	$("#l-pwd").val('')
	                	location.href = '../user/user.html'
	                }else{
	                	base.hideLoading();
	                	base.showMsg(res.msg)
	                }
	        	});
        	}
        })
    }
});