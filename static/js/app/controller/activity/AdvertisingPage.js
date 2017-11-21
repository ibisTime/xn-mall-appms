define([
    'app/controller/base',
    'app/util/ajax',
    'lib/swiper-3.3.1.jquery.min',
    'jweixin'
], function(base, Ajax, Swiper, wx) {
    var url = "801051",
    	userId = base.getUserId(),
        code = base.getUrlParam("code") || "",
        refereer = getUrlParamR("refereer") || "",
        config = {
            code: code,
            userId: userId
        },
        rate2,rate4,advPic,title,slogn,status, endDatetime
        now = new Date();

        var i = 10;
		var isUse = false;
		var intervalID;

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
            if (!base.isLogin()) {
                location.href = "../user/login.html?return=" + encodeURIComponent(location.pathname + location.search);
                return;
            }
            if(status == 2 || endDatetime < now) {
                $("#shareMask1").removeClass("hidden");
                base.confirm("该活动已结束，看看其他活动？").then(function(){
                   location.href = "../activity/promotionList.html?fist=0";
               },function(){
                   $("#shareMask1").addClass("hidden");
               })
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
            $("#cont").remove();
            if (response.success) {
                var data = response.data;
                if (data.isDZ) {
                    $("#goodImg").attr("src", "/static/images/good1.png");
                }
                
                var pics = base.getPicArr(data.pic),
                	htmlPic = "";
                    pics.forEach(function(d, i){
                        htmlPic += "<div class='swiper-slide'><div style='background-image:url("+d+");'></div></div>";
                    });
                    
                $("#top-swiper").html(htmlPic);
                $("#name").text(data.name);
                $("#slogan").text(data.slogan);
                $("#totalDzNum").text(data.totalDzNum);
                $("#advert").text(data.advert);
                $("#address").text(data.province + " " + data.city + " " + data.area + " " + data.address);
                $("#detailCont").append('<a class="fr clearfix" href="tel://' + data.bookMobile + '"><span class="pr6 va-m inline_block">' + data.bookMobile + '</span><img class="wp18p va-m" src="/static/images/phone.png"/></a>');
                $("#description").html(data.description);
                
                if(pics.length&&pics.length>1){
                	var mySwiper = new Swiper('#swiper-container', {
	                    'direction': 'horizontal',
	                    // 如果需要分页器
	                    'pagination': '.swiper-pagination'
	                });
                }

                rate2 = data.rate2;
                rate1 = data.rate1;
                rate4 = data.rate4;
                advPic = data.advPic;
                title = data.title;
                slogn = data.slogn;
                status = data.status;
                endDatetime = new Date(base.formatDate(data.endDatetime,"yyyy/MM/dd  hh:mm:ss"));
                i = data.readTimes;
                setBtnDisTimeSpan("#sbtn", i)
            } else {
                doError();
            }
        });
    }

    function doError() {
        $("#description").html('<div class="bg_fff tc wp100">暂时无法获取活动信息</div>');
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
                title: title, // 分享标题
                desc: slogn, // 分享描述
                link: window.location.href+"&refereer="+userId, // 分享链接
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
                link: window.location.href+"&refereer="+userId, // 分享链接
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
                link: window.location.href+"&refereer="+userId, // 分享链接
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
                link: window.location.href+"&refereer="+userId, // 分享链接
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
        })
    }

    function shareWx() {
    	$.when(
			Ajax.get("801030",{
				companyCode: SYSTEM_CODE,
				category: "A",
	    		interacter: base.getUserId(),
			    entityCode: code,
			    type: "4",
                refereer: refereer
	    	})
		).then(function(res){
    		if(res.success){
    			var confirmContent = ""
    			if(res.length) {
    				confirmContent = "分享成功，恭喜你获得" + + "个积分！<br/>是否前往商城？","否","是"
    			} else {
    				confirmContent = "分享成功，是否前往商城？","否","是"
    			}
    			base.confirm(confirmContent).then(function(){
                location.href = "../consume/consume.html";
        	},function(){
                location.href = "/activity/promotionList.html?fist=0";
        	})
    		}else{
    			base.showMsg(res.msg)
    		}
    		
    	})
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


        function getUrlParamR(name) {
           var url = location.search;
           var theRequest = new Object();
           if (url.indexOf("?") != -1) {
              var str = url.substr(1);
              strs = str.split("&");
              for(var i = 0; i < strs.length; i ++) {
                 theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
              }
           }
           return theRequest[name];
        }


});
