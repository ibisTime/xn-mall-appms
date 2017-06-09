define([
    'app/controller/base',
    'app/util/ajax',
    'jweixin',
    'lib/fingerprint2',
], function(base, Ajax, wx, Fingerprint2) {
    var distance,
        hasName;
    var hasName = base.getUrlParam("hasName"),
        distance = base.getUrlParam("distance"),
        hCode = base.getUrlParam("hCode");
    var userId = base.getUserId();
        
    var shakeWinStatus = 0; //1为中奖，0为没中奖

    var fingerprint;
   	
    new Fingerprint2().get(function(result){
		
		fingerprint = result; //a hash, representing your device fingerprint
		
	    init();
	});
	
    function init() {
    	
        $(".hasName").text(hasName);
        if (distance < 200) {
            distance = "小于200";
        }
        $(".distance").text(distance + "m");
        initQrCode();
        addListener();
        getInitWXSDKConfig();
    }
    
    
       
    function initQrCode(){
        $('#code').qrcode({
            width: 200, //宽度
            height: 200, //高度
            text: SHAKEURL+"/index.html" //任意内容
        });
        
    }
    // 获取微信初始化的参数
    function getInitWXSDKConfig() {
        Ajax.get("807910", {
            companyCode: SYSTEM_CODE,
            url: location.href.split("#")[0]
        }).then(function(res) {
            initWXSDK(res.data);
        }, function() {
            // alert("catch");
        });
    }
    // 初始化微信参数
    function initWXSDK(data) {
        wx.config({
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: ["onMenuShareQQ", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQZone"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function() {
            // 分享给朋友
            wx.onMenuShareAppMessage({
                title: "菜狗商城,摇一摇领奖", // 分享标题
                desc: "菜狗商城,摇一摇领奖", // 分享描述
                link: window.location.href+"&userReferee="+userId, // 分享链接
                imgUrl: SHAKEURL+"/static/images/logo2.png", // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                    shakeWin();
                },
                fail: function(msg) {
                    alert(JSON.stringify(msg));
                }
            });
            // 分享到朋友圈
            wx.onMenuShareTimeline({
                title: "菜狗商城,摇一摇领奖", // 分享标题
                desc: "菜狗商城,摇一摇领奖", // 分享描述
                link: window.location.href+"&userReferee="+userId, // 分享链接
                imgUrl: SHAKEURL+"/static/images/logo2.png", // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                    shakeWin();
                },
                fail: function(msg) {
                    alert(JSON.stringify(msg));
                }
            });
            // 分享到QQ
            wx.onMenuShareQQ({
                title: "菜狗商城,摇一摇领奖", // 分享标题
                desc: "菜狗商城,摇一摇领奖", // 分享描述
                link: window.location.href+"&userReferee="+userId, // 分享链接
                imgUrl: SHAKEURL+"/static/images/logo2.png", // 分享图标
                success: function () {
                   shakeWin();
                },
                fail: function(msg) {
                    alert(JSON.stringify(msg));
                }
            });
            // 分享到QQ空间
            wx.onMenuShareQZone({
                title: "菜狗商城,摇一摇领奖", // 分享标题
                desc: "菜狗商城,摇一摇领奖", // 分享描述
                link: window.location.href+"&userReferee="+userId, // 分享链接
                imgUrl: SHAKEURL+"/static/images/logo2.png", // 分享图标
                success: function () {
                   shakeWin();
                },
                fail: function(msg) {
                    alert(JSON.stringify(msg));
                }
            });
        });
        wx.error(function(error) {
            alert("微信分享sdk初始化失败" + JSON.stringify(error));
        })
    }
    function addListener() {
        $("#shakeAfterSta1").on("click", function(){
            $("#shakeAfterSta1").removeClass("active");
        });
    }
    function shakeWin() {
    	$.when(
			Ajax.get("615120",{
	    		"userId": base.getUserId(),
			    "hzbCode": hCode,
			    "deviceNo": fingerprint
	    	}),
    		base.getDictList("802006","currency")
		).then(function(res,res1){
    		if(res.success && res1.success){
    			var distRes = res1.data;
    			var yyAmount = base.formatMoneyD(res.data.yyAmount);
    			var yyCurrency = dictArray(res.data.yyCurrency,distRes)
    			
    			$("#yyAmount").html("获取"+yyAmount+yyCurrency)
    			$("#shakeAfterSta1").addClass("active");
    			
    			setTimeout(function(){
    				$("#shakeAfterSta1").removeClass("active");
    				location.href="../index.html"
    			},1500)
    		}else{
    			base.showMsg(res.msg)
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
