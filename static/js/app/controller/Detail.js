define([
    'app/controller/base',
    'app/util/ajax',
    'lib/swiper-3.3.1.jquery.min',
], function(base, Ajax, Swiper) {
    var url = "808218",
        code = base.getUrlParam("c") || "",
        config = {
            code: code,
            userId: base.getUserId()
        },
        rate2,rate4;

    initView();

    function initView() {
        if (code) {
            business();
            addListeners();
        } else {
            $("#cont").remove();
            base.showMsg("未传入商家编号!");
        }
    }

    function addListeners() {
        //点赞
        $("#dzIcon").on("click", function() {
        	if(!base.isLogin()){
                base.goLogin();
                return;
            }
            var $img = $("#goodImg");
            $img.attr("src");
            if ($img.attr("src").indexOf("/good.png") != -1) {
                praise();
            } else {
                praise(true);
            }
        });
        //抵金券消费
        $("#sbtn").on("click", function() {
            if (!base.isLogin()) {
                location.href = "../user/login.html?return=" + encodeURIComponent(location.pathname + location.search);
                return;
            }
            $("#choseDialog").removeClass("hidden");
        });
        $("#choseDialog").click(function() {
            $("#choseDialog").addClass("hidden");
        });
        $("#caigoPay").click(function(e) {
            e.stopPropagation();
            location.href = "./integral_consume.html?c=" + code + "&n=" + $("#name").text();
        });
        $("#cnyPay").click(function(e){
            e.stopPropagation();
            location.href = "../pay/cny_consume.html?c=" + code + "&rate=" + rate2 + "&n=" + $("#name").text();
        })
        $("#rmbPay").click(function(e){
            e.stopPropagation();
            location.href = "../pay/rmb_consume.html?c=" + code + "&rate=" + rate1+ "&rate4=" + rate4  + "&n=" + $("#name").text();
        })
    }
    //点赞
    function praise(flag) {
        var span = $("#totalDzNum"),
            img = $("#goodImg");
        $("#loaddingIcon").removeClass("hidden");
        Ajax.post('808240', {
            json: {
                storeCode: code,
                type: 1,
                userId: base.getUserId()
            }
        }).then(function(response) {
            $("#loaddingIcon").addClass("hidden");
            if (response.success) {
                if (!flag) {
                    span.text(+ span.text() + 1);
                    img.attr("src", "/static/images/good1.png");
                } else {
                    span.text(+ span.text() - 1);
                    img.attr("src", "/static/images/good.png");
                }
            } else if (response.timeout) {
                location.href = "../user/login.html?return=" + encodeURIComponent(location.pathname + location.search);
            } else {
                base.showMsg(response.msg);
            }
        });
    }
    //根据code搜索商家信息
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
            } else {
                doError();
            }
        });
    }

    function doError() {
        $("#description").html('<div class="bg_fff tc wp100">暂时无法获取商家信息</div>');
    }
});
