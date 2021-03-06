define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    var config = {
	        start: 1,
	        limit: 10,
    		companyCode: COMPANY_CODE,
    		systemCode: SYSTEM_CODE,
    		toUser: base.getUserId()
	    }, isEnd = false, canScrolling = false;
	
	var lbType = {
	        "1": ['大礼包'],
	        "2": ['小礼包'],
	        "3": ['保底礼包'],
	    };
	var isYhqValue = 1;
	
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
		            data.forEach(function(account) {
		                if(account.currency == 'LBB'){
		                    $("#LBBAmount").text(base.formatMoney(account.amount));
		                }else if(account.currency == 'YHQ'){
		                    $("#YHQAmount").text(base.formatMoney(account.amount));
		                }
		            });
		        }else{
	        		base.showMsg(res.msg)
	        	}
            });
    }
    
    //获取联盟券购买钱包币金额
    function getLBLMQQBBAMOUNT(){
    	return Ajax.get('808501',{
    		isYhq:isYhqValue
    	},false).then(function (res){
            	if(res.success){
            		var data = res.data
            		if(isYhqValue==1){
            			$("#isYhq").removeClass('hidden')
	            		$(".buyQBB-LMQ").html(base.formatMoney(data.lmqAmount))
	            		$(".buyQBB-YHQ").html(base.formatMoney(data.yhqAmount))
	            		$(".buyQBB-QBB").html(base.formatMoney(data.qbbAmount))
            		}else{
            			$("#isYhq").addClass('hidden')
	            		$(".buyQBB-LMQ").html(base.formatMoney(data.lmqAmount))
	            		$(".buyQBB-QBB").html(base.formatMoney(data.qbbAmount))
            		}
		        }else{
	        		base.showMsg(res.msg)
	        	}
            });
    }
    
    //购买钱包币
    function getBuyQBB(){
    	base.showLoading()
    	return Ajax.get('808500',{
    		isYhq:isYhqValue
    	},false).then(function(res){
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
        return Ajax.get('808515', config, false).then(function(res) {
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
                    isEnd && $("#content").append('<div class="no-data">已经全部加载完毕</div>')
                    config.start++;
	            } else if(config.start == 1) {
                    $("#content").html('')
                } else {
	                $("#content").append('<div class="no-data">已经全部加载完毕</div>')
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
            	html += '<div class="con">您获得了由幸运数字'+item.purchaseLbNumber+'送出的'+lbType[item.type]+'一个，请注意查收。</div>'
            }
				html += '</div></div>';
        });
        
        return html;
    }
	
	function addListener(){
		//下拉加载
        $(window).off("scroll").on("scroll", function() {
            if (canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())) {
                canScrolling = false;
                base.showLoading();
                getPageLbBack();
            }
        });
		
		//退出
		$("#logout").click(function(){
			base.showLoading('退出中...')
			base.logout();
			setTimeout(function(){
				location.replace('./login.html?timestamp=' + new Date().getTime())
			},500)
		})
		
		//购买钱包币
		$("#buyQBB").click(function(){
			$("#isYhqDialog").removeClass('hidden')
		})
		
		//是否优惠券-弹窗否
		$("#isYhqDialog .cancel").click(function(){
			isYhqValue = 0;
			
			base.showLoading()
			getLBLMQQBBAMOUNT().then(function(){
				base.hideLoading()
				$("#isYhqDialog").addClass('hidden')
				$("#buyQBBDialog").removeClass('hidden')
			})
		})
		//是否优惠券-弹窗是
		$("#isYhqDialog .confim").click(function(){
			isYhqValue = 1;
			
			base.showLoading()
			getLBLMQQBBAMOUNT().then(function(){
				base.hideLoading()
				$("#isYhqDialog").addClass('hidden')
				$("#buyQBBDialog").removeClass('hidden')
			})
		})
		
		//兑换-弹窗取消
		$(".am-modal .am-modal-header .am-modal-close").click(function(){
			$(".dialog").addClass('hidden')
		})
		
		//兑换-弹窗取消
		$("#buyQBBDialog .cancel").click(function(){
			$("#buyQBBDialog").addClass('hidden')
		})
		
		//兑换-弹窗确认
		$("#buyQBBDialog .confim").click(function(){
			getBuyQBB();
		})
		
		//余额
		$("#account").click(function(){
			location.href='./account.html?timestamp=' + new Date().getTime()
		})
		
		//优惠券
		$("#YHQaccount").click(function(){
			location.href='./YHQ-account.html?timestamp=' + new Date().getTime()
		})
		
		//幸运数字
		$("#luckNumbers").click(function(){
			location.href='../luckyNumbers/luckyNumbers.html?timestamp=' + new Date().getTime()
		})
		
	}
});