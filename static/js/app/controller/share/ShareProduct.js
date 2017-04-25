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
    		base.getDictList("currency","802006"),
    		Ajax.get("808917",{
    			"key":"SP_YUNFEI",
    			"systemCode": SYSTEM_CODE,
    			"companyCode": COMPANY_CODE,
    		})
    	).then(function(res,dres,yres){
			if(res.success && dres.success && yres.success){
				
				var distRes = dres.data;
				
				var dadvpic = res.data.advPic;
				var dpic = res.data.pic;
				var dadvText = res.data.name;
				var systemCode = res.data.systemCode;
				var dslogan = res.data.slogan;
				var dyunfei = yres.data.cvalue;
				var dprice1 = res.data.price1;
				var dprice2 = res.data.price2;
				var dprice3 = res.data.price3;
				
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
				
				if(dprice1==0){
					dprice1="";
				}else if(dprice1!=0 && dprice2==0 && dprice3==0){
					dprice1= dprice1/1000 +"人民币";
				}else{
					dprice1= dprice1/1000 +"人民币"+"+";
				}
				
				if(dprice2==0){
					dprice2="";
				}else if(dprice2!=0 && dprice1==0 && dprice3==0){
					dprice2= dprice2/1000 +"购物币";
				}else{
					dprice2= dprice2/1000 +"购物币"+"+";
				}
				
				if(dprice3!=0){
					dprice3= dprice3/1000 +"钱包币"
				}else{
					dprice3="";
				}
				
				
				$(".d-banner div img").attr("src",PIC_PREFIX+dadvpic+THUMBNAIL_SUFFIX)
				$(".d-tit").html(dadvText);
				$(".d-slogan").html(dslogan);
				$(".s-img").html(base.loadImg(s));
				$(".s-con").html(res.data.description)
				$(".s-price").html(dprice1+dprice2+dprice3)
				$(".d-yunfei").html("运费："+dyunfei+"元");
				
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