define([
    'app/controller/base',
    'app/util/ajax',
    'swiper'
], function(base, Ajax, swiper) {
	var dCode = base.getUrlParam("code");//"J201702241406556369";
	var ddate = "";//日期
	var dMaxNum ;//
	var dtemplateCode ;
	var defaultPhoto =  __inline("../images/icon-img.png");
	var dtprice = 0;
	var dfprice = 0;
	var dfCurrency;
	
    init();
    
    function init() {
    	
        addListener();
        initSwiper();
        
		//参与
		$("#d-btn-join").click(function(){
			
			base.confirm("下载app")
				.then(function(){
					base.getLocation();//跳转
				},function(){});
		})
		
    }

 	function initSwiper(){
        new Swiper('#swiperBanner', {
            'autoplay': 4000,
        });
    }

    function addListener() {
    	
    	$.when(
    		Ajax.get("808026",{"code":dCode}),
    		base.getDictList("currency","802006")
    	).then(function(res,dres){
			if(res.success && dres.success){
				
				var distRes = dres.data;
				
				var dadvpic = res.data.advPic;
				var dpic = res.data.pic;
				var dadvText = res.data.name;
				var systemCode = res.data.systemCode;
				var dslogan = res.data.slogan;
				
				dtemplateCode = res.data.code;
				dtprice = (res.data.toAmount/1000).toFixed(2);
				dfprice = (res.data.fromAmount/1000).toFixed(2);
				dfCurrency = dictArray(res.data.fromCurrency,distRes);
				
				//图片
		    	var strs= []; //定义一数组 
				var s = "";
				strs=dpic.split("||"); //字符分割
				
				for (i=0;i<strs.length ;i++ ) { 
					s+="<img src='"+PIC_PREFIX+strs[i]+"'/>";
				}
				
				$(".d-banner div img").attr("src",PIC_PREFIX+dadvpic+THUMBNAIL_SUFFIX)
				$(".d-tit").html(dadvText);
				$(".d-slogan").html(dslogan);
				$(".s-img").html(base.loadImg(s));
				$(".s-con").html(res.data.description)
				
			}else{
				base.showMsg(res.msg)
			}
		},function(){
			base.showMsg("加载失败")
		})
    
    
    }

	function dictArray(dkey,arrayData){//类型
		for(var i = 0 ; i < arrayData.length; i++ ){
			if(dkey == arrayData[i].dkey){
				return arrayData[i].dvalue;
			}
		}
	}
});