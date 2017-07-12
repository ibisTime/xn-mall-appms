define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dict',
    'lib/swiper-3.3.1.jquery.min',
    'app/module/loadImg/loadImg'
], function(base, Ajax, dict, Swiper, loadImg) {

    var isEnd = false,
        canScrolling = false;
    var indexTopImg = dict.get("indexTopImg");
    var imgWidth = (($(window).width() - 20) / 2 - 8) + "px";
    var config = {
        "status": "3",
        "start": 1,
        "limit": 15,
        "orderColumn": "order_no",
        "orderDir": "asc",
        "location":"1"
    };

    init();
    base.getCartLength();

    function init() {
        addListeners();
        $.when(
            //获取大类的数据字典
            Ajax.post("808007", {
                json: {
                    "parentCode": "0",
                    "status": "1",
                    "orderColumn": "order_no",
                    "orderDir": "asc",
                    type: "1"
                }
            }),
            //获取产品信息
            getPageProduct(true),
	        getBanner(),
	        getNotice()
        ).then(function(res1) {
            if (res1.success) {
                var list1 = res1.data;
                //    遍历大类
                $.each(list1, function(i, val) {
                    var pic1 = val.pic,
                        name1 = val.name,
                        code1 = val.code;

                    var html1 = '<li><div><img src="' + base.getImg(pic1) + '" alt=""></div><p>' + name1 + '</p></li>';
                    html1 = $(html1);
                    html1.on("click", function() {
                        location.href = "./mall_list.html?c=" + code1;
                    })
                    $(".classOne").append(html1)
                });
                $("#cont").hide();
            }
        });
    }
    
    //公告
    function getNotice(){
    	Ajax.get("804040",{
    		"pushType": 41,
    		"toKind": 1,
    		"channelType": 4,
    		"status": 1,
    		"start": 1,
			"limit": 1,
			"fromSystemCode":SYSTEM_CODE
    	}).then(function(res){
    		if(res.success){
    			if(res.data.list.length){
    				$(".noticeCon p").text(res.data.list[0].smsTitle)
    			}
    		}
    		
    	})
    }
    
    //banner图
    function getBanner(){
        Ajax.get("806051", {
            type: "2"
        }).then(function(res){
            if(res.success && res.data.length){
                var html = "";
                res.data.forEach(function(item){
                        
                    html += '<div class="swiper-slide"><img data-url= "'+item.url+'" class="wp100" src="' + base.getImg(item.pic, 1) + '"></div>';
                });
                $("#top-swiper").html(html);
                var mySwiper = new Swiper('#swiper-container', {
                    'direction': 'horizontal',
                    'loop': true,
                    'autoplay': 2000,
		            'autoplayDisableOnInteraction': false,
                    // 如果需要分页器
                    'pagination': '.swiper-pagination'
                });
            }
        });
    }
    function getPageProduct(refresh){
        config.start = refresh && 1 || config.start;
        return Ajax.get("808025", config, !refresh)
            .then(function(res){
                if(res.success){
                    var html = "";
                    $.each(res.data.list, function(i, val) {
                        var pic2 = val.advPic,
                            name = val.name,
                            slogan = val.slogan,
                            originalPrice = val.originalPrice
                                ? val.originalPrice / 1000
                                : "",
                            price2 = val.price2
                                ? base.formatMoney(val.price2) + "菜狗币"
                                : "",
                            price3 = val.price3
                                ? base.formatMoney(val.price3) + "抵金券"
                                : "",
                            code = val.code;
                        
                        
                        html += '<li class="ptb8 clearfix b_bd_b plr10"><a class="show p_r min-h100p" href="../operator/buy.html?code=' + code +
	                        '"><div class="order-img-wrap tc"><img class="center-img1" src="' + base.getImg(pic2, 1)  + 
	                        '"></div><div class="order-right-wrap clearfix"><p class="t_323232 s_12 line-tow">' + name + 
	                        '</p><p class="t_999 s_10 line-tow">' + slogan +'</p><p class="t_red ptb4">';
                        
                        if(val.price2!=0&&val.price3!=0){
                        	html +='<span class="s_12 t_red">' + price2 +'</span>';
                        	html +='<span class="s_12 t_red">+' + price3 +'</span>';
                        }else if(val.price2==0&&val.price3!=0){
                        	html +='<span class="s_12 t_red">' + price3 +'</span>';
                        }else if(val.price2!=0&&val.price3==0){
                        	html +='<span class="s_12 t_red">' + price2 +'</span>';
                        }
                        
                        html +='</p><p class="s_10">市场参考价：<span>' +
                        originalPrice + '</span>元</p></div></a></li>';
                    })
                    $("#contUl").append(loadImg.loadImg(html));
                    if(config.limit > res.data.list.length || config.limit >= res.data.totalCount){
                        isEnd = true;
                    }else{
                        config.start++;
                    }
                }else{
                    base.showMsg(res.msg);
                }
            });
    }
    function addListeners() {
        $("#searchIcon").on("click", function() {
            var sVal = $("#searchInput").val().trim();
            sVal = decodeURIComponent(sVal);
            location.href = "./search.html?s=" + sVal;
        });
        $(window).on("scroll", function() {
            // var me = $(this);
            if (canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())) {
                canScrolling = false;
                addLoading();
                addListener();
            }
        });
        
        $("#swiper-container").on("touchstart", ".swiper-slide img", function (e) {
            var touches = e.originalEvent.targetTouches[0],
                me = $(this);
            me.data("x", touches.clientX);
        });
        $("#swiper-container").on("touchend", ".swiper-slide img", function (e) {
            var me = $(this),
                touches = e.originalEvent.changedTouches[0],
                ex = touches.clientX,
                xx = parseInt(me.data("x")) - ex;
            if(Math.abs(xx) < 6){
                var url = me.attr('data-url');
                if(url){
                	if(!/^http/i.test(url)){
                		location.href = "http://"+url;
                	}else{
                		location.href = url;
                	}
                	
                }
                    
            }
        });
    }

});
