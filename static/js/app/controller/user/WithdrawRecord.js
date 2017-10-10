define([
    'app/controller/base',
    'app/util/ajax',
], function(base, Ajax) {
    var accountNumber = base.getUrlParam("accountNumber");
    var config = {
	        start: 1,
	        limit: 20,
        	accountNumber: accountNumber,
    		companyCode: COMPANY_CODE,
    		systemCode: SYSTEM_CODE
	    }, isEnd = false, canScrolling = false,
	    withdrawStatus = {
	        "1": ['正在处理中'],
	        "2": ['失败已退回'],
	        "3": ['正在处理中'],
	        "4": ['失败已退回'],
	        "5": ['已处理成功'],
	    };
    
    init();
    
    function init() {
        base.showLoading();
        $.when(
        	getPageFlow()
        ).then(function() {
        	base.hideLoading();
        	addListener()
        });
    }
    
    function getPageFlow() {
        return Ajax.get('802755',config).then(function(res) {
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
	            } else {
	                $("#content").html('<li class="no-data">暂无取现记录</li>')
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
            var transAmount = +item.amount;
            transAmount = base.formatMoney(transAmount);
            var createDatetime = item.applyDatetime,
                day = base.formatDate(createDatetime, "MM/dd"),
                time = base.formatDate(createDatetime, "hh:mm");

            html += '<div class="flow-item">'
                 + '<div class="am-flexbox">'
                 + '<div class="flow-datetime">'
                 + '    <p class="f-date">'+day+'</p>'
                 + '    <p class="f-time">'+time+'</p>'
                 + '</div>'
                 + '<div class="flow-content am-flexbox-item"><p class="f-transAmount f-trans-blue">'+transAmount+'</p><p class="flow-remark">'+withdrawStatus[item.status]+'</p>'
                 + '</div></div></div>';
        });
        
        return html;
    }
    
    function addListener() {
        //下拉加载
        $(window).off("scroll").on("scroll", function() {
            if (canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())) {
                canScrolling = false;
                showLoading();
                getPageFlow();
            }
        });
    }
});
