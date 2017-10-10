define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/setTradePwd'
], function(base, Ajax, setTradePwd) {
	var tradepwdFlag = 0;
	var mobile;
    var config = {
	        start: 1,
	        limit: 10,
    		companyCode: COMPANY_CODE,
    		systemCode: SYSTEM_CODE
	    }, isEnd = false, canScrolling = false;
	
	var lbType = {
	        "1": ['大礼包'],
	        "2": ['小礼包'],
	        "3": ['保底礼包'],
	    };
	
    init();
    
    function init(){
    	base.showLoading()
    	$.when(
    		getUserInfo(),
    		getAccount(),
    		getPageLbBack()
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
        return Ajax.get('802503')
            .then(function (res){
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
    
    //购买钱包币
    function getBuyQBB(){
    	base.showLoading()
    	return Ajax.get('808500',{},false).then(function(res){
    		base.hideLoading()
    		if(res.success){
				$("#buyQBBDialog").addClass('hidden')
    			base.showMsg('购买成功！');
    			setTimeout(function(){
    				location.replace(location.href)
    			},800)
    			
    		}else{
    			base.showMsg(res.msg)
    		}
    		
    	})
    }
    
    //获取礼包返现
	function getPageLbBack(){
        return Ajax.get('808515',config).then(function(res) {
			base.hideLoading()
			if(res.success){
	        	var data = res.data
	            var lists = data.list;
	            var totalCount = +data.totalCount;
	            if (totalCount <= config.limit || lists.length < config.limit) {
	                isEnd = true;
	            }
	            if(data.list.length) {
	                $("#content").append(buildHtml(data.list));
	            }
	            canScrolling = true;
	        }else{
				base.showMsg(res.msg)
			}
        });
	}
	
	function buildHtml(data) {
        var html = "";
    	data.forEach(function(item) {
            var createDatetime = base.formatDate(item.createDatetime, "yyyy年MM月dd日 hh:mm:ss");

            html += '<div class="lbBack-item"><div class="icon"></div><div class="line"></div>'
				 +  '<div class="wrap"><div class="time">'+createDatetime+'</div>';
				 
			if(item.type==3){
            	html += '<div class="con">您获得了由平台送出的'+lbType[item.type]+'一个，请注意查收。</div>'
            }else{
            	html += '<div class="con">您获得了由幸运数字'+item.id+'送出的'+lbType[item.type]+'一个，请注意查收。</div>'
            }
				html += '</div></div>';
        });
        
        return html;
    }
	
	function addListener(){
		setTradePwd.addCont({
			mobile:mobile,
			successUrl:'./withdraw.html'
		})
		//提现
		$("#withdraw").click(function(){
			if(tradepwdFlag==0&&!tradepwdFlag){
				setTradePwd.showCont()
			}else{
				location.href='./withdraw.html'
			}
		})
		
		//退出
		$("#logout").click(function(){
			base.showLoading('退出中...')
			base.logout();
			setTimeout(function(){
				location.replace('./login.html')
			},500)
		})
		
		//购买钱包币
		$("#buyQBB").click(function(){
			$("#buyQBBDialog").removeClass('hidden')
		})
		
		//弹窗取消
		$(".dialog .cancel").click(function(){
			$("#buyQBBDialog").addClass('hidden')
		})
		
		//弹窗确认
		$(".dialog .confim").click(function(){
			getBuyQBB();
		})
	}
});