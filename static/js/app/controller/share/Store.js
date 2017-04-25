define([
    'app/controller/base',
    'app/util/ajax',
    'swiper'
], function(base, Ajax, swiper) {
	var dCode = base.getUrlParam("code");
	
    init();
    
    function init() {
    	
        addListener();
        initSwiper();
		
		//参与
		$("#btn-md").click(function(){
			
			base.confirm("请下载app")
				.then(function(){
					base.getLocation();//跳转
				},function(){});
		})
		
		
    }
	
	function initSwiper(){
        new Swiper('#swiperBanner', {
            'autoplay': 3000
        });
    }
	
    function addListener() {
    	
    	Ajax.get("808218",{
    		code:dCode
    	}).then(function(res){
    		if(res.success){
    			var dadvpic = res.data.advPic;
    			var dpic = res.data.pic;
    			
    			//图片
		    	var strs= []; //定义一数组 
				var s = "";
				strs=dpic.split("||"); //字符分割
				
				for (i=0;i<strs.length ;i++ ) { 
					s+="<img src='"+PIC_PREFIX+strs[i]+"'/>";
				}
    			
    			if(res.data.province ==res.data.city){
    				var daddress = res.data.province+res.data.area+res.data.address
    			}else{
    				var daddress = res.data.province+res.data.city+res.data.area+res.data.address
    			}
    			
    			$(".d-banner div img").attr("src",PIC_PREFIX+dadvpic+THUMBNAIL_SUFFIX)
    			$(".store-name").html(res.data.name);
    			$(".store-address").html(daddress);
    			$(".store-tel").html(res.data.bookMobile);
				$(".s-img").html(base.loadImg(s));
				$(".s-con").html(res.data.description)
    			
    			
    		}else{
    			base.showMsg(res.msgsssss)
    		}
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