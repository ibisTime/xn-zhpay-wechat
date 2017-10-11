define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {
	var code = base.getUrlParam('code') || "";
    var config = {
	        start: 1,
	        limit: 10,
	        lbCode: code,
    		companyCode: COMPANY_CODE,
    		systemCode: SYSTEM_CODE
	    }, isEnd = false, canScrolling = false;
	var lbType = {
	        "1": ['大礼包'],
	        "2": ['小礼包'],
	        "3": ['保底礼包'],
	    };
	
	init()
	
	function init(){
		$.when(
			getLuckyNumbersDetail(),
			getPageLbBack()
		).then(function(){
			addListener();
		},function(){
			addListener();
		})
		
	}
	
	//获取礼包详情
	function getLuckyNumbersDetail(){
		base.showLoading()
		return Ajax.get('808506',{code}).then(function(res){
			base.hideLoading()
			if(res.success){
				var data = res.data
				
				$("#luckyNumber").html(data.number)
				if(data.status == 1){
					$("#MonthlyBenefits").html('已完结')
				}else{
					$("#MonthlyBenefits").html(data.bdBackCount+'/'+data.bdTotalCount)
				}
				$("#dlb").html(data.dlbBackCount+'/'+data.dlbTotalCount)
				$("#xlb").html(data.xlbBackCount+'/'+data.xlbTotalCount)
			}else{
				base.showMsg(res.msg)
			}
		},function(){
			base.hideLoading()
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
                    isEnd && $("#content").append('<div class="no-data">已经全部加载完毕</div>')
                    config.start++;
	            } else if(config.start == 1) {
                    $("#content").html('<div class="no-data">暂无记录</div>')
                } else {
	                $("#content").appendTo('<div class="no-data">已经全部加载完毕</div>')
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
            var transAmount = +item.toAmount1;
            transAmount = base.formatMoney(transAmount);
            var createDatetime = item.createDatetime,
                day = base.formatDate(createDatetime, "MM/dd"),
                time = base.formatDate(createDatetime, "hh:mm");

            html += '<div class="flow-item">'
                 + '<div class="am-flexbox">'
                 + '<div class="flow-datetime">'
                 + '    <p class="f-date">'+day+'</p>'
                 + '    <p class="f-time">'+time+'</p>'
                 + '</div>'
                 + '<div class="flow-content am-flexbox-item"><p class="f-transAmount f-trans-blue">'+transAmount+'</p>';
                 
            if(item.type==3){
            	
            	html += '<p class="flow-remark">平台送出的'+lbType[item.type]+'</p>'
            }else{
            	html += '<p class="flow-remark">第'+item.purchaseLbNumber+'号送出的'+lbType[item.type]+'</p>'
            }
            html += '</div></div></div>';
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
	}
	
});