define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/setTradePwd'
], function(base, Ajax, setTradePwd) {
    var config = {
        start: 1,
        limit: 20,
		companyCode: COMPANY_CODE,
		systemCode: SYSTEM_CODE,
    }, isEnd = false, canScrolling = false;
    var tradepwdFlag = false, mobile,
    	distRes = [];

    init();

    function init() {
        base.showLoading();
        $.when(
        	getDictList(),
            getAccount(),
            getUserInfo()
        ).then(base.hideLoading);
        addListener();
    }
    
    //获取bizType 数据字典
    function getDictList(){
    	return base.getDictList("biz_type","802006").then(function(res){
        	if(res.success){
				distRes = res.data;
			}else{
        		base.showMsg(res.msg)
        	}
    	})
    }
    // 获取账户信息
    function getAccount() {
    	return Ajax.get('802503')
            .then(function (res){
            	if(res.success){
            		var data = res.data
		            data.forEach((account) => {
		                if(account.currency == 'LBB'){
		                    $("#amount").text(base.formatMoney(account.amount));
                        	config.accountNumber = account.accountNumber;
		                }
		            });
		            
                	getPageFlow();
		        }else{
	        		base.showMsg(res.msg)
	        	}
            });
    }
    //获取用户信息
    function getUserInfo(){
    	return Ajax.get('805056').then(function(res){
    		if(res.success){
    			mobile = res.data.mobile
    			tradepwdFlag = res.data.tradepwdFlag
    		}else{
    			base.showMsg(res.msg)
    		}
    	})
    }
    
    // 分页查询流水
    function getPageFlow() {
        return Ajax.get('802520',config, false).then(function(res) {
            base.hideLoading();
    		if(res.success){
    			var data = res.data
    			var lists = data.list;
	            var totalCount = +data.totalCount;
	            if (totalCount <= config.limit || lists.length < config.limit) {
	                isEnd = true;
	            }
	            if(data.list.length) {
	                $("#content").append(buildHtml(data.list));
	                config.start++;
	            } else if(config.start == 1) {
	                $("#content").html('<div class="no-data">暂无资金流水</div>')
	            } else {
	                $("#content").append('<div class="no-data">已经全部加载完毕</div>')
	            }
	            canScrolling = true;
    		}else{
    			base.showMsg(res.msg)
    		}
        }, base.hideLoading);
    }
    function buildHtml(data) {
        var html = "";
        data.forEach((item) => {
            var transAmount = base.formatMoney(item.transAmount);
            var createDatetime = base.formatDate(item.createDatetime, "yyyy年MM月dd日 hh:mm:ss");
			var bizType = dictArray(item.bizType,distRes);
            
            html += '<div class="account-item b_e_b"><div class="account-item-top over-hide">'
                 + '    <p class="account-bizType fl">'+bizType+'</p>'
                 + '    <p class="account-date fr">'+createDatetime+'</p>'
                 + '</div>'
                 + '<div class="account-item-transAmount">'
                 + '    <p class="account-transAmount">'+transAmount+'</p>'
                 + '</div>'
                 + '<div class="account-item-bizNote">'
                 + '    <p class="account-bizNote">'+item.bizNote+'</p>'
                 + '</div></div>';
        });
        return html;
    }
    
	function dictArray(dkey,arrayData){//类型
		for(var i = 0 ; i < arrayData.length; i++ ){
			if(dkey == arrayData[i].dkey){
				return arrayData[i].dvalue;
			}
		}
	}
    
    function addListener() {
        //下拉加载
        $(window).off("scroll").on("scroll", function() {
            if (canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())) {
                canScrolling = false;
                base.showLoading();
                getPageFlow();
            }
        });
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
    }
});
