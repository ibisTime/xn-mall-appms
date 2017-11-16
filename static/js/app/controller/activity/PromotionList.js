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
    var userId = base.getUserId();
    var fist = base.getUrlParam("fist") || "";
    var config = {
        "status": "1",
        "start": 1,
        "limit": 15,
        "orderColumn": "order_no",
        "orderDir": "asc"
    };

    init();

    function init() {
        addListeners();
        $.when(
            getPageAdvertise(true),
        	getBanner(),
            fist == "0"? "" :getEarnValue()
        ).then(function() {
            $("#cont").hide();
        });
    }
    
    //banner图
    function getBanner(){
        Ajax.get("806051", {
            type: "2",
            location:"4"
        }).then(function(res){
            if(res.success && res.data.length){
                var html = "";
                res.data.forEach(function(item){
                        
                    html += '<div class="swiper-slide"><img data-url= "'+item.url+'" class="wp100 hp188p" src="' + base.getImg(item.pic, 1) + '"></div>';
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
    function getPageAdvertise(refresh){
        config.start = refresh && 1 || config.start;
        return Ajax.get("801050", config, !refresh)
            .then(function(res){
                if(res.success && res.data.list){
                    var html = "";
                    $.each(res.data.list, function(i, val) {
                        var pic2 = val.advPic,
                            title = val.title,
                            slogn = val.slogn,
                            code = val.code,
                            count = val.count;
                            
                        html += '<li class="ptb15 clearfix b_bd_b plr20"><a class="show p_r min-h70p" href="../activity/advertisingPage.html?code=' + code +
	                        '"><div class="order-img-wrap1 tc"><img class="center-img1" src="' + base.getImg(pic2, 1)  + 
	                        '"></div><div class="order-right-wrap1 clearfix"><p class="t_323232 s_12 line-tow">' + title + 
	                        '</p><p class="t_999 s_10 wp70 hp100 break-word line-tow">' + slogn +'</p>'+
                            '<p class="t_blue s_10 wp70 hp100 break-word line-tow">' + count +'人加入</p>'+
                            '<p class=" ptb4 s_12 w70p hp40p br_4p t_white bg_f64444 tc" style="position: absolute;right: 0;top: 2rem;">进入</p>';
                    })
                    $("#contUl").append(loadImg.loadImg(html));
                    if(config.limit > res.data.length || config.limit >= res.data.list.totalCount){
                        isEnd = true;
                    }else{
                        config.start++;
                    }
                }else{
                    base.showMsg(res.msg);
                }
            });
    }
    function getEarnValue() {
        $.when(
            Ajax.get("802517",{
                    companyCode: SYSTEM_CODE
            }),
            Ajax.get("802518",{
                    companyCode: SYSTEM_CODE,
                    userId: userId
            })          
        ).then(function(res, res1){
            if(res.success && res1.success){
                $("#choseDialog").removeClass("hidden");
                var html = "", html1 = "", currency ="", currency1 ="", currency2 ="", currency3 ="", amount= "", res1 = res1.data, res = res.data;
                if(res1.length > 0 ) {
                    $.each(res1, function(i, val){
                        amount = val.amount;
                        currency = val.currency.split(',');
                        if(currency.length == 1) {
                            if(currency[0] == "CNY") {
                                currency = `人民币`;
                            } else if(currency[0] == "CGJF") {
                                currency = `抵金券`;
                            } else if(currency[0] == "CGB") {
                                currency = `菜狗币`;
                            } else{
                                currency[0] = ``;
                            }
                        } else {
                            currency.forEach(function(cur, i){
                                if(cur == "CNY") {
                                    return i == 0 ? currency1 = `人民币` : currency1 += `,人民币` ;
                                } else if(cur == "CGJF") {
                                    return i == 0 ? currency1 = `抵金券` : currency1 += `,抵金券`;
                                } else if(cur == "CGB") {
                                    return i == 0 ? currency1 = `菜狗币` : currency1 += `,菜狗币`;
                                }
                            })

                            currency = currency1;
                        }
                    })                    
                }else{
                    amount = 0;
                    currency = `,去分享吧!`;
                }
                html += `您今日分享活动获取 `+ base.formatMoney(amount)  + currency;
                $.each(res, function(i, val){
                    amount = val.amount;
                    currency = val.currency.split(',');
                    if(currency.length == 1) {
                        if(currency[0] == "CNY") {
                            currency = `人民币`;
                        } else if(currency[0] == "CGJF") {
                            currency = `抵金券`;
                        } else if(currency[0] == "CGB") {
                            currency = `菜狗币`;
                        } else{
                            currency[0] = ``;
                        }
                    } else {
                        currency.forEach(function(cur, i){
                            if(cur == "CNY") {
                                return i == 0 ? currency1 = `人民币` : currency1 += `,人民币` ;
                            } else if(cur == "CGJF") {
                                return i == 0 ? currency1 = `抵金券` : currency1 += `,抵金券`;
                            } else if(cur == "CGB") {
                                return i == 0 ? currency1 = `菜狗币` : currency1 += `,菜狗币`;
                            }
                        })

                        currency = currency1;
                    }
                    html1 += `<li class="ptb4 clearfix mlr15">`;
                    if(i <= 2) {
                        html1 +=  `<div class="wp20p pt4 inline_block fl mr15 mt4" style="vertical-align: middle;">`;
                    }else{
                        html1 +=  `<div class="wp10p pt4 inline_block fl ml4 mr20 mt4" style="vertical-align: middle;">`;
                    }
                               
                    html1 +=`<img src="/static/images/` + (i + 1) + `@2x.png" />
                        </div>
                        <div class="wp62 inline_block fl s_11"> `+ val.realName +`</div>
                        <div class="wp62 inline_block fl t_999 s_10">分享活动获得`+ currency +`</div>
                        <div class="wp25 inline_block fr s_11  tr">`+ base.formatMoney(amount)  + `</div>
                     </li>`;
                    currency = "";
                })
                $('.am-modal-currentUser-content').html(html);
                $('.am-modal-list ul').append(html1);
            }else{
                base.showMsg(res.msg)
            }    
        })
    }
    function addListeners() {
        $("#choseDialog").click(function() {
            $("#choseDialog").addClass("hidden");
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
