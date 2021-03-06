define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {
    var config = {
	        start: 1,
	        limit: 50,
	    }, isEnd = false, canScrolling = false;
		
	init()
	
	function init(){
		getLuckyNumbers();
		addListener();
	}
	
	function getLuckyNumbers(){
		base.showLoading()
		return Ajax.get('808507',config, false).then(function(res){
			base.hideLoading()
			if(res.success){
				var data = res.data;
	            var lists = data.list;
	            var totalCount = +data.totalCount;
	            if (totalCount <= config.limit || lists.length < config.limit) {
	                isEnd = true;
	            }
	            if(data.list.length) {
	                $("#content").append(buildHtml(data.list));
                    config.start++;
	            } else if(config.start == 1) {
                    $("#content").html('<div class="no-data">暂无幸运数字</div>')
                }
	            canScrolling = true;
			}else{
				base.showMsg(res.msg)
			}
		},function(){
			base.hideLoading()
		})
	}
	
	function buildHtml(data) {
        var html = "";
    	data.forEach(function(item) {
    		var status = item.status==1?'red':'blue';

            html += '<div class="luckyNumbers-item '+status+'">'
                 + '<a href="./luckyNumber-detail.html?code='+item.code+'&timestamp=' + new Date().getTime()+'" class="con">'+item.number+'</a></div>';
        });
        
        return html;
    }
	
	function addListener(){
		
		//下拉加载
        $(window).off("scroll").on("scroll", function() {
            if (canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())) {
                canScrolling = false;
                base.showLoading();
                getLuckyNumbers();
            }
        });
        
	}
	
});