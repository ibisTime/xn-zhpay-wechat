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
		return Ajax.get('808507',config).then(function(res){
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
	            } else {
	                $("#content").html('<li class="no-data">暂无幸运数字</li>')
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
                 + '<a href="./luckyNumber-detail.html?code='+item.code+'" class="con">'+item.number+'</a></div>';
        });
        
        return html;
    }
	
	function addListener(){
		
	}
	
});