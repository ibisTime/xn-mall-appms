define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dict',
    'jweixin'
], function(base, Ajax, Dict, wx) {
    var url = "801051",
        userId = base.getUserId(),
        code = base.getUrlParam("code") || "",
        refereer = base.getUrlParam("refereer") || "",
        config = {
            code: code,
            userId: userId
        }, advPic, title, slogn, status, endDatetime,
        now = new Date();

    var i = 10;
		var isUse = false;
		var intervalID;
    var fetchCount = 2;

    initView();

    function initView() {
        if (code) {
            getInitWXSDKConfig();
            business();
            addListeners();
        } else {
            $("#cont").remove();
            base.showMsg("未传入活动编号!");
        }
    }

    function addListeners() {
        $("#sbtn").on("click", function() {
            if(status == 2 || endDatetime < now) {
                $("#shareMask1").removeClass("hidden");
                base.confirm("该活动已结束，看看其他活动？").then(function(){
                    location.href = "../activity/promotionList.html?fist=0";
                },function(){
                    $("#shareMask1").addClass("hidden");
                });
            } else {
                $("#shareMask").removeClass("hidden");
            }
        });
        $("#shareMask").click(function() {
            $("#shareMask").addClass("hidden");
        });
        $("#shareMask1").click(function() {
            $("#shareMask1").addClass("hidden");
        });
    }

    //根据code搜索活动信息
    function business() {
        Ajax.get(url, config).then(function(response) {
            if (response.success) {
                var data = response.data;
                $("#description").html(data.description);
                advPic = data.advPic;
                title = data.title;
                slogn = data.slogn;
                status = data.status;
                endDatetime = new Date(base.formatDate(data.endDatetime,"yyyy/MM/dd  hh:mm:ss"));
                i = data.readTimes;
                setBtnDisTimeSpan("#sbtn", i);
                isReady();
            } else {
                doError();
            }
        });
    }

    function doError() {
        $("#cont").remove();
        $("#description").html('<div class="bg_fff tc wp100">暂时无法获取活动信息</div>');
    }

    function isReady() {
      if (!--fetchCount) {
        $("#cont").remove();
        initWXSDK(wxConfig);
      }
    }
    var wxConfig;
    // 获取微信初始化的参数
    function getInitWXSDKConfig() {
        Ajax.get("807910", {
            companyCode: SYSTEM_CODE,
            url: location.href.split("#")[0]
        }).then(function(res) {
            wxConfig = res.data;
            isReady();
        }, function() {
            // alert("catch");
        });
    }
    function getLink() {
        var url = window.location.href;
        if (/refereer/.test(url)) {
          url.replace(/refereer=([^&$]+)/,'refereer=' + userId);
        } else {
          url += '&refereer=' + userId;
        }
        return url;
    }
    // 初始化微信参数
    function initWXSDK(data) {
        var link = getLink();
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
                title: title, // 分享标题
                desc: slogn, // 分享描述
                link: link, // 分享链接
                imgUrl: PIC_PREFIX+"/" + advPic, // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                    if (i == -1) {
                        shareWx();
                    }
                },
                fail: function(msg) {
                    alert(JSON.stringify(msg));
                }
            });
            // 分享到朋友圈
            wx.onMenuShareTimeline({
                title: title, // 分享标题
                desc: slogn, // 分享描述
                link: link, // 分享链接
                imgUrl: PIC_PREFIX+"/" + advPic, // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                    if (i == -1) {
                        shareWx();
                    }
                },
                fail: function(msg) {
                    alert(JSON.stringify(msg));
                }
            });
            // 分享到QQ
            wx.onMenuShareQQ({
                title: title, // 分享标题
                desc: slogn, // 分享描述
                link: link, // 分享链接
                imgUrl: PIC_PREFIX+"/" + advPic, // 分享图标
                success: function () {
                   if (i == -1) {
                        shareWx();
                    }
                },
                fail: function(msg) {
                    alert(JSON.stringify(msg));
                }
            });
            // 分享到QQ空间
            wx.onMenuShareQZone({
                title: title, // 分享标题
                desc: slogn, // 分享描述
                link: link, // 分享链接
                imgUrl: PIC_PREFIX+"/" + advPic, // 分享图标
                success: function () {
                   if (i == -1) {
                        shareWx();
                    }
                },
                fail: function(msg) {
                    alert(JSON.stringify(msg));
                }
            });
        });
        wx.error(function(error) {
            alert("微信分享sdk初始化失败" + JSON.stringify(error));
        });
    }
    var currencyType = Dict.get('currencyType');
    function shareWx() {
      	Ajax.get("801030", {
            companyCode: SYSTEM_CODE,
	        category: "A",
		    interacter: base.getUserId(),
		    entityCode: code,
		    type: "4",
            refereer: refereer
  	    }).then(function(res){
    		if (res.success) {
      			var confirmContent = ""
      			if(res.data && res.data.code) {
				    confirmContent = "分享成功，恭喜你获得" + base.formatMoney(res.data.amount) + "个" + currencyType[res.data.currency] + "！<br/>是否前往商城？";
      			} else {
				    confirmContent = "分享成功，是否前往商城？";
      			}
      			base.confirm(confirmContent).then(function(){
                    location.href = "../consume/consume.html";
              	},function(){
                    location.href = "/activity/promotionList.html?fist=0";
              	});
    		} else {
                base.showMsg(res.msg);
    		}
      	});
    }
		function setBtnText(btn, btnText) {
		    if (i >= 0) {
		        $(btn).text( "阅读完成后分享为有效分享("+i.toString() + "s)");
		        i--;
		    } else {
		        window.clearInterval(intervalID);
		        $(btn).removeAttr("disabled").text(btnText).addClass('bg_f64444');
		        isUse = false;
		    }
		}

		function setBtnDisTimeSpan(btn, t) {
		    if (!isUse) {
		        i = t;
		        intervalID = setInterval(function(){
		        	setBtnText(btn, '分享得好礼')
		        }, 1000);
		        isUse = true;
		    } else {
		        alert("请先完成阅读，还剩" + i + "秒");
		    }
		}
});
