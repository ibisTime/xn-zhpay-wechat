define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
], function(base, Ajax,loading) {
	
	var code = base.getUrlParam("code");
	var captchaTime = 60;//重新发送时间
	var urlStatus = base.getUrlParam("status");//如果从领取红包页跳转
	var userReferee = base.getUrlParam("userReferee");
	var temp ="";
	var dCityData = "";
	var dprovince ;
	var dcity ;
	var darea ;
	
    init();
    //放入省市区json
    base.getAddress()
        .then(function(data){
        	dCityData = data.citylist;
        });
        

    function init() {
        addListener(); 
    }
    

    function addListener() {
		$(".r-input").focus(function(){
        	$(this).siblings(".r-input-placeholder").html(" ");
        })
        $(".r-input").blur(function(){
        	var txt = $(this).siblings(".r-input-placeholder").attr("data-txt");
        	if($(this).val()==""){
        		$(this).siblings(".r-input-placeholder").html(txt);
        	}
        })
        
        $("#r-tel").blur(function(){
        	var userTel = $(this).val();
        	
        	getProvingTel($(this));
        	if(temp == "" || temp !=userTel){
        		temp =userTel
				captchaTime=60;
				$("#rbtn-captcha").html("获取验证码");
        	}else{
        		temp = temp;
        	}
        })
        
        //注册协议
        
        $(".r-popup-close").click(function(){
        	$(".r-popup").fadeOut(500);
        });
        
        $(".r-protocol").click(function(){
        	
        	$(".popup-protocol").fadeIn(500);
        	Ajax.get("807717",{
	        	"ckey": "reg_protocol",
	    		"systemCode": SYSTEM_CODE
	        }).then(function(res) {
	                if (res.success) {
	                	$(".r-popup-tit").html(res.data.cvalue)
	                	$(".r-popup-conten").html(res.data.note)
	                } else {
	                	base.showMsg(res.msg);
	                }
	            }, function() {
	                base.showMsg("获取注册协议失败");
	            });
        });
        
        //验证码
        $("#rbtn-captcha").click(function(){
        	
        	var userTel = $("#r-tel").val();
        	
        	if(userTel == null || userTel == ""){
        		base.showMsg("请输入手机号");
        	}else if(getProvingTel($("#r-tel"))){
        		
        		if(captchaTime==60){
					timer = setInterval(function(){
						captchaTime--;
						
						$("#rbtn-captcha").html("重新发送("+captchaTime+")");
						
						if(captchaTime<0){
							clearInterval(timer);
							captchaTime=60;
							$("#rbtn-captcha").html("获取验证码");
						}
					},1000);
					
					var parem={
						"mobile":userTel,
						"bizType":"805041",
			            "kind": "f1",
			            "systemCode":SYSTEM_CODE
					}
					
					Ajax.post("805904",{json:parem})
						.then(function(res) {
			                if (res.success) {
			                } else {
			                	base.showMsg(res.msg);
			                }
			            }, function() {
			                base.showMsg("获取验证码失败");
			            });
				}
        	}
        });
        
        $("#r-address").click(function(){
    		getProvinceBuy();
    	});
        
        //地址 -省
    	$("#province").click(function(){
    		getProvinceBuy();
    	});

        //地址 -市
        $("#city").click(function(){
        	var provinceVal = $(".province").html();
        	
            var val = $(".province").attr("data-num");
            if(val){
                getCityBuy(val);
                $(".city").addClass("on");
            }else{
                $(".city").removeClass("on");
                base.showMsg("请先选择省")
            }
        });

        //地址 -区
        $("#area").click(function(){
            var valTml = $(".city").attr("data-num");
            if(valTml){
                valTml = valTml.split(",");
                var val = valTml[0];
                var val1 = valTml[1];
                getAreaBuy(val, val1);
                $(".area").addClass("on");
            }else{
                $(".area").removeClass("on");
                base.showMsg("请先选择区")
            }

        });
        
        $("#popup-Btn").click(function(){
			dprovince = $(".province").html();
			dcity = $(".city").html();
			darea = $(".area").html();
			var userTel = $("#r-tel").val();
        	var userCaptcha = $("#r-captcha").val();
        	var userPwd = $("#r-pwd").val();
			
			if(dprovince == "请选择省"){
				
        		base.showMsg("请选择省");
        		
        	}else if(dcity == "请选择市"){
        		
        		base.showMsg("请选择市");
        		
        	}else if(darea == "请选择区"){
        		
        		base.showMsg("请选择区");
        	}else{
				var parem={
					"mobile": userTel,
					"loginPwd": userPwd,
					"loginPwdStrength": base.calculateSecurityLevel(userPwd),
					"userReferee": userReferee,
					"smsCaptcha": userCaptcha,
					"kind": "f1",
					"isRegHx": "1",
					"province": dprovince,
					"city": dcity,
					"area": darea,
					"systemCode":SYSTEM_CODE
				}
	        	
	        	Ajax.post("805041",{json:parem})
					.then(function(res) {
		                if (res.success) {
		                	$(".r-popup").fadeOut(500);
		                	if(urlStatus==1){
								location.href = "../share/share-receive.html?code="+code+"&userReferee="+userReferee;
							}else{
								base.confirm("注册成功!")
								.then(function(){
									base.getLocation();//跳转
								},function(){});
							}
		                } else {
		                	$(".r-popup").fadeOut(500);
		                	base.showMsg(res.msg);
		                }
		            }, function() {
		            	$(".r-popup").fadeOut(500);
		                base.showMsg("注册失败");
	            	});
			}
        })
        
        //提交
        $("#rbtn-sub").click(function(){
        	var userTel = $("#r-tel").val();
        	var userCaptcha = $("#r-captcha").val();
        	var userPwd = $("#r-pwd").val();
        	
        	if(userTel == null || userTel == ""){
        		base.showMsg("请输入手机号");
        	}else if(userCaptcha == null || userCaptcha == ""){
        		base.showMsg("请输入验证码");
        	}else if(userPwd == null || userPwd == ""){
        		base.showMsg("请输入密码");
        	}else if(getProvingTel($("#r-tel"))){
        		
        		
        		base.getInitLocation(function(res){
					dprovince = sessionStorage.getItem("province");
					dcity = sessionStorage.getItem("city");
					darea = sessionStorage.getItem("area");
					
					$(".popup-address").fadeIn(500);
					
//					var parem={
//						"mobile": userTel,
//						"loginPwd": userPwd,
//						"loginPwdStrength": base.calculateSecurityLevel(userPwd),
//						"userReferee": userReferee,
//						"smsCaptcha": userCaptcha,
//						"kind": "f1",
//						"isRegHx": "1",
//						"province": dprovince,
//						"city": dcity,
//						"area": darea,
//						"systemCode":SYSTEM_CODE
//					}
//		        	
//		        	Ajax.post("805041",{json:parem})
//						.then(function(res) {
//			                if (res.success) {
//			                	
//			                	if(urlStatus==1){
//									location.href = "../share/share-receive.html?code="+code+"&userReferee="+userReferee;
//								}else{
//									base.confirm("注册成功!")
//									.then(function(){
//										base.getLocation();//跳转
//									},function(){});
//								}
//			                } else {
//			                	base.showMsg(res.msg);
//			                }
//			            }, function() {
//			                base.showMsg("注册失败");
//		            	});
					
				},function(){
					loading.hideLoading();
					base.showMsg("定位失败请手动填写地址",1000);
					setTimeout(function(){
						$(".popup-address").fadeIn(500);
					},1000)
					
				})
        	}
        	
        })
        
    }
    
    
    function getCaptchaTime(obj,code){
		var timer ;
		
		timer = setInterval(function(){
			code--;
			obj.html("重新发送("+code+")");
			
			if(code<0){
				clearInterval(timer);
				code=60
				obj.html("获取验证码");
			}
		},1000)
	}
    
    function getProvingTel(obj){
		var val=obj.val();
		var mobilevalid = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
		
		if (!mobilevalid.test(val)) {
			base.showMsg("请输入正确的手机号码！");
			return false;
		}else{
			return true;
		}
	}
    
    
    //选择省
	function getProvinceBuy() {
    	$("body #address_div").remove();
	    var province = dCityData;
	    var newStr = [];
	    
	    newStr.push("<div id='address_div'><div class='addressTop'><samp></samp>选择地区</div><ul>");
	    for (var i = 0, psize = province.length; i < psize; i++) {
	        newStr.push("<li data-num='" + i + "'>" + province[i].p + "</li>");
	    }
	    
	    newStr.push("</ul></div>");
	    $("body").append(newStr.join(""));
	    $("#address_div").on("click","ul li",function(){
			var val = $(this).attr("data-num");


            if($(".province").attr("data-num") != val || $(".province").attr("data-num")==null){
                if (!province[val].c[0].a){
                    $("#area").hide();
                    $(".cityTit").html("区县");
                    $(".city").html("请选择区").removeClass("on");
                    $(".area").removeClass("on");
                }else{
                    $("#area").show();
                    $(".city").removeClass("on");
                    $(".cityTit").html("城市");
                    $(".city").html("请选择市").removeClass("on");
                }
                
            }

            $(".province").html($(this).html()).attr("data-num",val).addClass("on");
            $(".area").html("请选择区").removeClass("on");
            $("body #address_div").remove();
	    })
        addressOut();
	}

	//选择市
	function getCityBuy(val) {
	    var province = dCityData;
	    var city = province[val].c;
	    var newStr = [];
	    newStr.push("<div id='address_div'><div class='addressTop'><samp></samp>选择地区</div><ul>");
	    for (var j = 0, csize = city.length; j < csize; j++) {
	        newStr.push("<li data-num='" + j + "," + val + "'  style='padding-left:20px;'>" + city[j].n + "</li>");
	    }
	    newStr.push("</ul></div>");
	    $("body #address_div").remove();
	    $("body").append(newStr.join(""));
	    
	    $("#address_div").on("click","ul li",function(){
            var valTml = $(this).attr("data-num");
                valTml = valTml.split(",");
            var val = valTml[0];
            var val1 = valTml[1];
            $(".city").html($(this).html()).attr("data-num",$(this).attr("data-num"));
            $(".area").html("请选择区").removeClass("on");
            $("body #address_div").remove();
	    });

        addressOut();
	}
	
	//选择区
	function getAreaBuy(val, val1) {
		
	    var province = dCityData;
	    var city = province[val].c;
	    var area = city[val1].a;
	    var newStr = [];
	    newStr.push("<div id='address_div'><div class='addressTop'><samp></samp>选择地区</div><ul>");
	    for (var t = 0, asize = area.length; t < asize; t++) {
	        newStr.push("<li  style='padding-left:25px;' data-num='" + val1 + "," + val + "," + t + "'>" + area[t].s + "</li>");
	    }
	    newStr.push("</ul></div>");
	    if (asize == 0) {
	        $("#city").val(city[val].s);
//	        provinceOut();
	
	    } else {
	        $("body #address_div").remove();
	        $("body").append(newStr.join(""));
	    }
        $("#address_div").on("click","ul li",function(){
            $(".area").html($(this).html()).attr("data-num",$(this).attr("data-num"));
            $("body #address_div").remove();
        })
        addressOut();
	}

    function addressOut() {
        $("#address_div").on("click",".addressTop",function(){
            $("body #address_div").remove();
        });
    }
    
    
});