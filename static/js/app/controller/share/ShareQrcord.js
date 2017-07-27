define([
    'app/controller/base',
    'app/util/ajax',
], function(base, Ajax) {
	
	var updateUrl ;
	
    init();
    
    function init() {
    	$(".sq-btn1").click(function(){
    		getUrl("C");
    	})
    	
    	$(".sq-btn2").click(function(){
    		getUrl("B");
    	})
    	
    }
	 
	
	function getUrl(t){
		Ajax.get("807715",{
			"type":"2",
		    "start": "1",
		    "limit": "20",
			"systemCode":SYSTEM_CODE,
			"companyCode":SYSTEM_CODE
		}).then(function(res) {
	        if (res.success) {
	        	updateUrl = res.data.list;
	        	var androidUrl ,iosUrl;
	        	
	        	updateUrl.forEach(function(v, i){
	        		
	        		if(t == "C"){
	        			if(v.ckey == "candroidDownUrl"){
		        			androidUrl = v.cvalue;
		        		}
	        			if(v.ckey == "ciosDownUrl"){
		        			iosUrl = v.cvalue;
		        		}
	        			
	        		}else if(t == "B"){
	        			if(v.ckey == "bandroidDownUrl"){
		        			androidUrl = v.cvalue;
		        		}
	        			if(v.ckey == "biosDownUrl"){
		        			iosUrl = v.cvalue;
		        		}
	        		}
	        		
	        	})
	        	
	        	base.getUserBrowser(iosUrl,androidUrl);//跳转
	        	
	        } else {
	        	base.showMsg(res.msg);
	        }
	    }, function() {
	        base.showMsg("获取下载地址失败");
	    });
	}
});