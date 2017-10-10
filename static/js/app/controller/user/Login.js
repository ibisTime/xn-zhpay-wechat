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
        	var param = {
        		loginName: $("#l-tel").val(),
        		loginPwd: $("#l-pwd").val(),
        		kind: 'f1',
        		companyCode: COMPANY_CODE,
        		systemCode: SYSTEM_CODE
        	}
        	base.getUserLogin(param).then(function(res){
                base.showLoading()
                if (res.success) {
                	base.hideLoading()
                	location.href = './user.html'
                }else{
                	base.hideLoading();
                	base.showMsg(res.msg)
                }
        	});
        })
    }
});