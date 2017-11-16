define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'lib/swiper-3.3.1.jquery.min'
], function(base, Ajax, dialog, Swiper) {
    $(function() {
        var mySwiper, rspData, user, code = base.getUrlParam("code") || "";
        var userId = sessionStorage.getItem("userId");
        
   		base.getCartLength();
   		
        param = {
            "code":code
        }
        Ajax.post("808026", {
              json:param
            })
            .then(function(res) {
                if (res.success) {

                    var data = res.data,
                        imgs_html = "";
                        rspData = data;
                        $("#buyBtn").click(function() {
                            if (!$(this).hasClass("no-buy-btn")) {
                                var choseCode = code;
                                location.href = "./submit_order.html?code=" + choseCode + "&q=" + $("#buyCount").val();
                            }
                        });
                        $("#addCartBtn").click(function() {
                            if (!$(this).hasClass("no-buy-btn")) {
                                add2Cart();
                            }
                        });
                        addListeners();
                        choseImg();
                        $("#cont").remove();

                } else {
                    doError("暂无数据");
                }
            });
        if (sessionStorage.getItem("user") !== "1") {
            base.getUser()
                .then(function(response) {
                    if (response.success) {
                        user = response.data;
                    }
                });
        } else {
            user = true;
        }

        function doError(msg) {
            var d = dialog({
                content: msg,
                quickClose: true
            });
            d.show();
            setTimeout(function() {
                d.close().remove();
            }, 2000);
        }

        function addListeners() {
            $("#subCount").on("click", function() {
                var orig = $("#buyCount").val();
                if (orig == undefined || orig == "" || orig == "0" || orig == "1") {
                    orig = 2;
                }
                orig = +orig - 1;
                $("#buyCount").val(orig);
                $("#buyCount").change();
                
                var msl = rspData;
	            var buyCount = $("#buyCount").val();
	            var CGB =  msl.price2 ? (base.formatMoney(msl.price2*buyCount)) +"菜狗币" : "",
	                 JF =  msl.price3 ? (base.formatMoney(msl.price3*buyCount)) +"抵金券" : "";
	                 
	            $(".CGB").text(CGB);
	            $(".JF").text(JF);
            });
            $("#addCount").on("click", function() {
                var orig = $("#buyCount").val();
                if (orig == undefined || orig == "") {
                    orig = 0;
                }
                orig = +orig + 1;
                $("#buyCount").val(orig);
                $("#buyCount").change();
                
                var msl = rspData;
	            var buyCount = $("#buyCount").val();
	            var CGB =  msl.price2 ? (base.formatMoney(msl.price2*buyCount)) +"菜狗币" : "",
	                 JF =  msl.price3 ? (base.formatMoney(msl.price3*buyCount)) +"抵金券" : "";
	                 
	            $(".CGB").text(CGB);
	            $(".JF").text(JF);
                
                
            });
            $("#buyCount").on("keyup", function(e) {
                var keyCode = e.charCode || e.keyCode;
                var me = $(this);
                if (!isSpecialCode(keyCode) && !isNumber(keyCode)) {
                    me.val(me.val().replace(/[^\d]/g, ""));
                }
                if (!me.val()) {
                    me.change();
                }
            }).on("change", function(e) {
                var keyCode = e.charCode || e.keyCode;
                var me = $(this);
                if (!isSpecialCode(keyCode) && !isNumber(keyCode)) {
                    me.val(me.val().replace(/[^\d]/g, ""))
                }
                if (!me.val()) {
                    me.val("1");
                }
                if (me.val() == "0") {
                    me.val("1");
                }
            });
        }


        //轮播图，获取需要的图片
        function choseImg() {
            var msl = rspData,
                pics = msl.pic;

            pics = pics.split("||");
                table_html = "<tbody>";
            if (!mySwiper) {
            	var html = "";
                $.each(pics,function (i,val) {
                    html += '<div class="swiper-slide tc"><img src="'+base.getImg(val, 1)+'"></div>';
                })
                $("#btlImgs").append(html);
                mySwiper = new Swiper('.swiper-container', {
                    'direction': 'horizontal',
                    'pagination': '.swiper-pagination'
                });
            }
            $("#btr-name").text(msl.name);
            $("#btr-slogan").text(msl.slogan);
            
            var price2 = msl.price2 ? base.formatMoney(msl.price2) +"菜狗币" : "",
                price3 = msl.price3 ? base.formatMoney(msl.price3)+"抵金券":"";
            $("#discountPrice").text(price2);
            if(msl.price2&&msl.price3){
            	$("#cnyPrice").text("+"+price3);
            }else{
            	$("#cnyPrice").text(price3);
            }
            
            $("#btr-description").append(msl.description);
            
            //产品参数
            if(msl.productSpecs.length){
            	var productSpe = "";
	            for (i=0;i<msl.productSpecs.length ;i++ ) {
	            	if(msl.productSpecs[i].dkey==0){
	            		productSpe+='<div class="tit">'+msl.productSpecs[i].dvalue+'</div>';	
	            	}else{
	            		productSpe+='<div class="list">'+msl.productSpecs[i].dvalue+'</div>';
	            	}
				}
	            
	            $("#productSpecs").html(productSpe);
	            $("#productSpecs").removeClass("hidden")
            }
            
            var buyCount = $("#buyCount").val();
            var CGB =  msl.price2 ? (base.formatMoney(msl.price2*buyCount)) +"菜狗币" : "",
                 JF =  msl.price3 ? (base.formatMoney(msl.price3*buyCount)) +"抵金券" : "";
            $(".CGB").text(CGB);
            $(".JF").text(JF);
        }

        function isNumber(code) {
            if (code >= 48 && code <= 57 || code >= 96 && code <= 105) {
                return true;
            }
            return false;
        }

        function isSpecialCode(code) {
            if (code == 37 || code == 39 || code == 8 || code == 46) {
                return true;
            }
            return false;
        }

        function add2Cart() {
            if (user == "1") {
                a2cart();
            } else {
                location.href = "../user/login.html?return=" + encodeURIComponent(location.pathname + location.search);
            }
        }

        function a2cart() {
            var choseCode = code,
                param1 = {
                    "userId": userId,
                    "productCode": choseCode || "",
                    "quantity": $("#buyCount").val()
                },
                url = "808040";
            Ajax.post(url, {json:param1})
                .then(function(response) {
                    var msg;
                    if (response.success) {
                        msg = "添加购物车成功!";
                    } else {
                        msg = "添加购物车失败!";
                    }
                    var d = dialog({
                        content: msg,
                        quickClose: true
                    });
                    d.show();
                    setTimeout(function() {
                        d.close().remove();
                    }, 2000);
                });
        }
    });
});