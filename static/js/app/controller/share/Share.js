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
	var dmaxInvestNum ;//最大投
	var surplusNum ;//剩余
	
    init();
    
    function init() {
    	
        addListener();
        initSwiper();
		
		$("#d-amount-plus").click(function(){
	    	var dnum = $("#d-amount-num").val();
	    	var footerAmount = 0;
	    	
	    	if(dnum<=1){
	    		dnum = 1;
	    	}else{
	    		dnum--;
	    	}
	    	
	    	footerAmount = dfprice*dnum;
	    	$("#d-amount-num").val(dnum)
	    	$(".d-footer-amount samp").text(footerAmount.toFixed(2)+dfCurrency);
	    })
	    
	    $("#d-amount-decrease").click(function(){
	    	var dnum = $("#d-amount-num").val();
	    	var footerAmount = 0;
	    	
	    	if(dnum>=dMaxNum){
	    		dnum = dMaxNum;
	    		base.showMsg("最大只能投"+dMaxNum);
	    	}else{
	    		dnum++;
	    	}
	    	
	    	footerAmount = dfprice*dnum;
	    	$("#d-amount-num").val(dnum)
	    	$(".d-footer-amount samp").text(footerAmount.toFixed(2)+dfCurrency);
	    })
		
		$(".d-amount-max").click(function(){
	    	var dnum = $("#d-amount-num").val();
	    	var footerAmount = 0;
	    	
	    	footerAmount = dtprice*dMaxNum;
	    	$(".d-footer-amount samp").text(footerAmount.toFixed(2)+dfCurrency);
			$("#d-amount-num").val(dMaxNum);
		})
		
		//参与
		$("#d-btn-join").click(function(){
			
			base.confirm("想要参与?请下载app")
				.then(function(){
					base.getLocation();//跳转
				},function(){});
		})
		
		//加载
		$(".updateMore").click(function(){
			base.confirm("想查看更多记录?请下载app")
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
    	
    	$.when(
    		Ajax.get("615016",{"code":dCode}),
    		base.getDictList("currency","802006")
    	).then(function(res,dres){
			if(res.success && dres.success){
				
				var distRes = dres.data;
				
				var dadvPic = res.data.advPic;
				var dadvText = res.data.slogan;
				var dperiods = res.data.periods;//期号
				var dtotalNum = res.data.totalNum;//总需
				var dinvestNum = res.data.investNum;//已投
				dmaxInvestNum = res.data.maxNum;//最大投
				surplusNum = parseInt(dtotalNum)-parseInt(dinvestNum);//剩余
				var barW = ((dinvestNum/dtotalNum).toFixed(2))* 100 + "%";//进度条
				var systemCode = res.data.systemCode;
				dtemplateCode = res.data.code;
				dtprice = (res.data.toAmount/1000).toFixed(2);
				dfprice = (res.data.fromAmount/1000).toFixed(2);
				dfCurrency = dictArray(res.data.fromCurrency,distRes);
				
				var dcreateDatetime = base.formatDate(res.data.startDatetime,"yyyy-MM-dd hh:mm:ss");//日期
				
				//图片
		    	var strs= []; //定义一数组 
				var s = "";
				strs=dadvPic.split("||"); //字符分割
				
				for (i=0;i<strs.length ;i++ ) { 
					s+="<div class='swiper-slide wp100'><img class='center-img' src='"+PIC_PREFIX+strs[i]+THUMBNAIL_SUFFIX2+"'/></div>";
				}
    	
				
				//最大投
				if(dmaxInvestNum>surplusNum){
					dMaxNum = surplusNum;
				}else{
					dMaxNum = dmaxInvestNum;
				}
				
//				$(".d-banner img").attr("src",PIC_PREFIX+dadvPic);

				$(".dBannerList").html(base.loadImg(s));
				$(".d-price").html(dtprice + dictArray(res.data.toCurrency,distRes));
				$(".d-tit").html(dadvText);
				$(".d-dperiods").html("期号:"+dperiods);
				$(".d-amountNum samp").text(dtotalNum);
				$(".d-SurplusNum samp").text(surplusNum);
				$(".progressBar").width(barW);
				$(".d-partakeTit samp").text("("+dcreateDatetime+"开始)");
				$(".d-footer-amount samp").text(dfprice+dfCurrency);
				
				if(dinvestNum == dtotalNum){
					$(".d-footer-btn").css({"background-color":"#999"})
				}
				
					Ajax.get("615025",{"jewelCode":dtemplateCode,
						"status": "123",
				    	"start": "1",
					    "limit": "10",
					    "systemCode":systemCode,
					    "companyCode":systemCode
					}).then(function(res1){
						if(res1.success){
							var list = "";
							
							if(res1.data.list.length>0){
								date =  res1.data.list[0].payDatetime.substring(0,10);
							
								for (var i = 0; i < res1.data.list.length ; i++) {
									var temlData = res1.data.list[i].payDatetime.substring(0,10)
									var s ="";
									var dpartakTxt1 = "参与了"+res1.data.list[i].times+"次";
									var dpartakTxt2 = "中了"+(res1.data.list[i].jewel.toAmount)/1000+dictArray(res1.data.list[i].jewel.toCurrency,distRes)+"大奖";
									var dphoto = PIC_PREFIX+res1.data.list[i].photo;
									
									if(res1.data.list[i].photo){
										console.log(dphoto)
										dphoto = dphoto;
									}else{
										
										dphoto = defaultPhoto;
									}
									
									
									
									if(date != temlData || i == 0){
										date = temlData;
										s+="<div class='d-hrW'>";
										s+="<div class='d-partak-date wp100 pz9'>"+temlData+"</div><div class='d-hr'></div></div>";
										s+="<div  class='d-hrW wp100 over-hide d-partakLis-wrap'>";
										s+="<div class='d-hr'></div>";
										s+="<div class='fl pz9 d-partak-img over-hide'><img src='"+dphoto+"'/></div>";
										s+="<div class='fl pz9 d-partak-info'>";
										s+="<h4 class='d-partak-name'>"+res1.data.list[i].user.nickname+"</h4>";
										s+="<samp class='d-partak-IP'>("+res1.data.list[i].ip+")</samp>";
										
										if(res1.data.list[i].status != 2){
											s+="<p class='d-partak-txt'>"+dpartakTxt1;
										}else{
											s+="<p class='d-partak-txt'>"+dpartakTxt2;
										}
										
										s+="<samp>"+res1.data.list[i].payDatetime+"</samp></p></div></div>";
									}else{
										s+="<div  class='d-hrW wp100 over-hide d-partakLis-wrap'>";
										s+="<div class='d-hr'></div>";
										s+="<div class='fl pz9 d-partak-img over-hide'><img src='"+dphoto+"'/></div>";
										s+="<div class='fl pz9 d-partak-info'>";
										s+="<h4 class='d-partak-name'>"+res1.data.list[i].user.nickname+"</h4>";
										s+="<samp class='d-partak-IP'>("+res1.data.list[i].ip+")</samp>";
										
										if(res1.data.list[i].status != 2){
											s+="<p class='d-partak-txt'>"+dpartakTxt1;
										}else{
											s+="<p class='d-partak-txt'>"+dpartakTxt2;
										}
										
										s+="<samp>"+res1.data.list[i].payDatetime+"</samp></p></div></div>";
									}
									
									list += s;
								}
							
							}
							
							$("#d-partakList").html(list);
						
						}else{
							base.showMsg(res1.msg)
						}
					},function(){
						base.showMsg("加载失败")
					})
				
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