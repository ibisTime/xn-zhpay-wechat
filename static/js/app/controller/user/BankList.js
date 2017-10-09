define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/addOrEditBankCard/index',
    'app/util/handlebarsHelpers'
], function(base, Ajax, addOrEditBankCard, Handlebars) {
    var _tmpl = __inline('../../ui/bank-item.handlebars');
    var config = {
        start: 1,
        limit: 10
    }, isEnd = false, canScrolling = false;

    init();
    function init() {
//		getPageBankCard();
        addListener();
    }
    //获取银行卡
    function getPageBankCard(refresh) {
        base.showLoading();
    	UserCtr.getPageBankCard(config, refresh)
            .then(function(data) {
                base.hideLoading();
                hideLoading();
                var lists = data.list;
                var totalCount = +data.totalCount;
                if (totalCount <= config.limit || lists.length < config.limit) {
                    isEnd = true;
                }
    			if(data.list.length) {
    				$("#addBtn").addClass('hidden')
                    $("#content")[refresh ? "html" : "append"](_tmpl({items: data.list}));
                    isEnd && $("#loadAll").removeClass("hidden");
                    config.start++;
    			} else if(config.start == 1) {
    				
    				$("#addBtn").removeClass('hidden')
                    $("#content").html('<li class="no-data">暂无银行卡</li>')
                } else {
                    $("#loadAll").removeClass("hidden");
                }
                canScrolling = true;
        	}, hideLoading);
    }
    function addListener() {
        addOrEditBankCard.addCont({
            userId: base.getUserId(),
            success: function() {
                config.start = 1;
                getPageBankCard(true);
            }
        });
        $(window).off("scroll").on("scroll", function() {
            if (canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())) {
                canScrolling = false;
                showLoading();
                getPageBankCard();
            }
        });
        $("#content").on("click", "li", function() {
            addOrEditBankCard.showCont({
                code: $(this).attr("data-code")
            });
        });
        $("#addBtn").on("click", function() {
            addOrEditBankCard.showCont();
        });
        
    }
    function showLoading() {
        $("#loadingWrap").removeClass("hidden");
    }

    function hideLoading() {
        $("#loadingWrap").addClass("hidden");
    }
});
