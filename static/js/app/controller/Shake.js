define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'lib/fingerprint2',
    'app/module/loading/loading'
], function(base, Ajax, dialog, Fingerprint2, loading) {

    var myScroll;
    var shakeStatus = 0; //1为已超过次数，0为未超过次数
    var user = sessionStorage.getItem("user");
    var token = sessionStorage.getItem("token");
    var userId = sessionStorage.getItem("userId");
    var fingerprint;
    var f = 1; //有没有判断
    var longitude, latitude;

	new Fingerprint2().get(function(result){
		
		fingerprint = result; //a hash, representing your device fingerprint
    	init();
	});
    getRule();

    function init() {
        loading.createLoading("定位中...");
		
        longitude = sessionStorage.getItem("longitude") || "";
        latitude = sessionStorage.getItem("latitude") || "";
        if(!longitude){
        	base.getInitLocation(function(res){
				longitude = sessionStorage.getItem("longitude");
				latitude = sessionStorage.getItem("latitude");
				
		    		loading.createLoading("加载中...");
                    doAction();
		    	},function(){
		    		
					loading.hideLoading();
					base.showMsg("定位失败",1000);
				})
        }else{
            loading.createLoading("加载中...");
            doAction();
        }
        
    	$(".play-way").on("click",function(){
            $(".playWays").css("display","block")
            $(".playWays button").on("click",function () {
                $(".playWays").css("display","none")
            })
        })
    	
    	$(".close").click(function(){
			$(".Mpopup").css("display","none")
		})
    }
    
    function getRule(){
		base.getSysConfig("807717","yyy_rule").then(function(res){
			$(".playWays-Content").html(res.data.note);
		})
    }
    
    function doAction(){
    	
        var param1 = {
            "userId": userId,
            "token": token,
            "longitude": longitude,
            "latitude": latitude

        };
        Ajax.post("805158", {json: param1})
            .then(function(res) {
                loading.hideLoading();
                if (res.success) {
                    addListener();
                    // getPraise();
                } else {
                    base.showMsg(res.msg)
                }
            });
    }
    function addListener() {
        if (window.DeviceMotionEvent) {
            var speed = 15; //定义一个数值
            var x = y = z = lastX = lastY = lastZ = 0; //重置所有数值
            window.addEventListener('devicemotion', function() {
                var acceleration = event.accelerationIncludingGravity; //将传感值赋给acceleration
                x = acceleration.x;
                y = acceleration.y;
                z = acceleration.z;
                if (Math.abs(x - lastX) > speed || Math.abs(y - lastY) > speed) {
                    // 在此处可以实现摇一摇之后所要进行的数据逻辑操作
                    if (f == 1) {
                        f = 0;
                        loading.showLoading("加载中...");
                        getPraise();
                    }
                }
                lastX = x;
                lastY = y;
                lastZ = z;
            }, false);
        }

    }
    function getPraise(){
        var param = {
            "longitude": longitude,
            "latitude": latitude,
            "userId": userId,
            "deviceNo": fingerprint,
            "companyCode": COMPANYCODE,
            "token": token
        }
        Ajax.post("615117", {json: param}).then(function(res) {
            loading.hideLoading();
            if (res.success) {
//              $("#shakeWrap").removeClass("shakeWrap").addClass("shakeWrapOn");
                if (res.data != "") {
                	setTimeout(function(){
                		f = 1;
                	},500)
                    // $(".shakeWrapOn").css("z-index","9");
                    location.href = "shake/shake-list.html";

                } else {
                    f = 1;
                    base.showMsg("附近没有摇钱树可以摇！")
                }

            } else {
                shakeAfterSta1(res.msg);
            }
        })
    }
    function shakeAfterSta1(msg) {
        $("<div class='wp100 hp100 pat0 bg_0_8 z_index9999' id='shakeAfterSta1'><div class='wp100'><img src='/static/images/xin-.png'/><p class='c_fe4332 fs20r pt40_b20r'>" + msg + "</p></div></div>").appendTo("body");
        $("#shakeAfterSta1").addClass("active");
        setTimeout(function() {
            $("#shakeAfterSta1").remove();
            f = 1;
        }, 2000);
    }

});
