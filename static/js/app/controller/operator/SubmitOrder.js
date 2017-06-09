define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dict',
    'app/util/dialog',
    'Handlebars',
    'app/module/loadImg/loadImg'
], function(base, Ajax, Dict, dialog, Handlebars, loadImg) {
    var code = base.getUrlParam("code") || "",
        type = base.getUrlParam("type") || "1",
        q = base.getUrlParam("q") || "1",
        receiptType = Dict.get("receiptType"),
        userId = sessionStorage.getItem("userId"),
        token = sessionStorage.getItem("token"),
        addrInfo = {},
        toUser = "";
    init();

    function init() {
        //获取地址信息
        (function() {
            var url ="805165",
                param = {
                    "userId":userId,
                    "token":token,
                    "isDefault": ""
                },
                addressTmpl = __inline("../../ui/submit-order-address.handlebars");
                
           		Ajax.post(url, {json:param})
                .then(function(response) {
                    $("#cont").hide();
                    if (response.success) {
                        var data = response.data,
                            html1 = "",
                            len = data.length;;
                        if (len) {
                            for (var i = 0; i < len; i++) {
                                if (data[i].isDefault == "1") {
                                    break;
                                }
                            }
                            if (i == len) {
                                i = 0;
                            }
                            addrInfo = data[i];
                            var content = addressTmpl(data[i]);
                            $("#addressDiv").append(content);
                            $("#addressRight").removeClass("hidden");
                        } else {
                            $("#noAddressDiv").removeClass("hidden");
                        }
                    } else {
                        doError("#addressDiv");
                    }
                });
        })();
        //单种商品购买
        if (type == 1) {
            getModel();
            //购物车点击购买
        } else if (type == 2) {
            code = code.split(/_/);
            getModel1();
        }
        //发票信息展示
        /*(function () {
            var html = '<option value="0">无</option>';
            for(var rec in receiptType){
                html += '<option value="'+rec+'">'+receiptType[rec]+'</option>';
            }
            $("#receipt").html(html);
        })();*/
        //获取货品商
        (function() {
            var html = "";
            Ajax.get('805055', {
                kind: "05",
                status: "0"
            }).then(function(res) {
                    if (res.success) {
                        var data = res.data,
                            html = "";
                        html += '<option value="' + SYSTEM_USERID + '">菜狗平台</option>';
                        for (var i = 0; i < data.length; i++) {
                            var d = data[i];
                            html += '<option value="' + d.userId + '">' + d.loginName + '</option>';
                        }
                        $("#seller").html(html);
                    }
                });
        })();
        addListeners();
    }

    function doError(cc) {
        $(cc).html('<div class="bg_fff" style="text-align: center;line-height: 150px;">暂时无法获取数据</div>');
    }
    //购物车点击购买后查询相关商品信息
    function getModel1() {
        var url = "808047";
        var param1 = {
            "userId": userId
        };
        Ajax.post(url, {json:param1})
            .then(function(response) {
                if (response.success) {
                    var data = response.data,
                        html = "",
                        totalCount = 0,
                        cnyTotalCount = 0;
                    if (data.length) {
                        var items = [],
                            flag = false,
                            html = '<ul class="b_bd_b">';

                        for (var i = 0, len = code.length; i < len; i++) {
                            var d = data[code[i]];
                            var eachCount = 0,
                                cnyEachCount = 0,
                                price2=0,
                                price3=0;
                            if (d.product.price2 && +d.product.price2) {
                                eachCount = (+d.product.price2) * (+d.quantity);
                            }
                            if (d.product.price3 && +d.product.price3) {
                                cnyEachCount = (+d.product.price3) * (+d.quantity);
                            }
                            totalCount += eachCount;    //菜狗币
                            cnyTotalCount += cnyEachCount;  //积分
                            html += '<li class="ptb8 clearfix b_bd_b plr10" modelCode="' + d.code + '">' +
                                '<a href="../operator/buy.html?code=' + d.productCode + '" class="show p_r min-h100p">' +
                                '<div class="order-img-wrap tc default-bg"><img class="center-img1" src="' +base.getImg(d.product.advPic, 1) + '"/></div>' +
                                '<div class="order-right-wrap clearfix"><div class="fl wp60">' +
                                '<p class="tl line-tow">' + d.product.name + '</p>' +
                                '</div>' +
                                '<div class="fl wp40 tr s_10">';
                                
                            if(d.product.price2){
                                html += '<p><span class="item_totalP">' + base.formatMoney(d.product.price2) + '</span><span class="t_40pe s_09 pl4">菜狗币</span></p>';
                            }
                            if (d.product.price3) {
                                html += '<p><span class="item_totalP">' + base.formatMoney(d.product.price3) + '</span><span class="t_40pe s_09 pl4">积分</span></p>';
                            }
                            html += '<p class="t_80">×<span>' + d.quantity + '</span></p></div></div></a></li>';
                        }
                        html += '</ul>';
                        $("#cont").hide();
                        $("#items-cont").append(loadImg.loadImg(html));
                        if(cnyTotalCount){
                            $("#totalCgbAmount").html(base.formatMoney(totalCount))
                                .parent().parent().removeClass("hidden");
                        }
                        if (cnyTotalCount) {
                            $("#mAdd, #JFDiv").removeClass("hidden");
                            $("#totalJFAmount").html(base.formatMoney(cnyTotalCount));
                        }
                    } else {
                        $("#cont").hide();
                        doError("#items-cont");
                    }
                } else {
                    $("#cont").hide();
                    doError("#items-cont");
                }
            });
    }
    //单种商品点击购买后查询相关信息
    function getModel() {
        var url = "808026",
            config = {
                "code": code
            };
        Ajax.post(url, {json:config})
            .then(function(response) {
                if (response.success) {
                    var data = response.data,
                        html = '';
                    if(data.price2){    //菜狗币
                        var totalCgbAmount = +data.price2 * +q;
                        $("#totalCgbAmount").html(base.formatMoney(totalCgbAmount))
                            .parent().parent().removeClass("hidden");
                    }
                    if(data.price3){    //积分
                        $("#mAdd, #JFDiv").removeClass("hidden");
                        var totalJFAmount = +data.price3 * +q;
                        $("#totalJFAmount").html(base.formatMoney(totalJFAmount));
                    }

                    html += '<ul class="b_bd_b">' +
                        '<li class="ptb8 clearfix b_bd_b plr10" modelCode="' + data.code + '">' +
                        '<a href="../operator/buy.html?code=' + data.code + '" class="show p_r min-h100p">' +
                        '<div class="order-img-wrap tc default-bg"><img class="center-img1" src="' + base.getImg(data.advPic) + '"/></div>' +
                        '<div class="order-right-wrap clearfix"><div class="fl wp60">' +
                        '<p class="tl line-tow">' + data.name + '</p>' +
                        '<p class="tl pt4 line-tow">' + data.slogan + '</p>' +
                        '</div>' +
                        '<div class="fl wp40 tr s_10">';
                    if(data.price2){
                        html += '<p><span class="item_totalP">' + base.formatMoney(data.price2) + '</span><span class="t_40pe s_09 pl4">菜狗币</span></p>';
                    }
                    if (data.price3) {
                        html += '<p><span class="item_totalP">' + base.formatMoney(data.price3) + '</span><span class="t_40pe s_09 pl4">积分</span></p>';
                    }
                    html += '<p class="t_80">×<span>' + q + '</span></p></div></div></a></li></ul>';

                    $("#items-cont").append(loadImg.loadImg(html));
                    $("#cont").hide();
                } else {
                    doError("#items-cont");
                }
            });
    }

    function addListeners() {
        //地址栏按钮
        $("#addressDiv").on("click", "a", function() {
            //如果没有地址，调到添加地址页
            if (this.id == "add-addr") {
            	sessionStorage.setItem("returnhref",  location.href);
                location.href = "./add_address.html?return=1";
             
             //调到地址列表页
            } else {
            	sessionStorage.setItem("returnhref",  location.href);
                location.href = "./address_list.html?c=" + $(this).attr("code") + "&return=1";
            }
        });
        //提交订单按钮
        $("#sbtn").on("click", function() {
            var $a = $("#addressDiv>a");
            //如果不是选择自提的方式，则判断是否选择地址
            if ($("#psfs").val() == "1") {
                if (!$a.length) {
                    showMsg("未选择地址");
                    return;
                }
            }
            //备注过长
            if ($("#apply_note").val().length > 255) {
                showMsg("备注字数必须少于255位");
                return;
            }
            //提交订单前准备相关参数
            PrepareConfig();
        });
        //配送方式
        $("#psfs").on("change", function() {
            var me = $(this);
            if (me.val() == "2") {
                $("#zt").addClass("hidden");
                $("#sj").removeClass("hidden");
                $("#addressDiv").addClass("hidden");
                $(".addressDivTitle").addClass("hidden");
            } else {
                $("#sj").addClass("hidden");
                $("#zt").removeClass("hidden");
                $("#addressDiv").removeClass("hidden");
                $(".addressDivTitle").removeClass("hidden");
            }
        });
    }
    //提交订单前准备相关参数
    function PrepareConfig() {
        var bizType = '808050',
            config;
        //如果是单种商品购买
        if (type == 1) {
            var tPrice = (+$("#items-cont").find(".item_totalP").text()) * 1000;
            config = {
                "productCode": code,
                "quantity": q
            };
            //如果是购物车购买
        } else if (type == 2) {
            var cartList = [],
                $lis = $("#items-cont > ul > li");
            for (var i = 0, len = $lis.length; i < len; i++) {
                cartList.push($($lis[i]).attr("modelCode"));
            }
            var config = {
                "cartCodeList": cartList
            };
            bizType = '808051';
        } else {
            showMsg("类型错误，无法提交订单");
            return;
        }
        //提交订单
        doSubmitOrder(config, bizType);
    }

    function showMsg(cont) {
        var d = dialog({
            content: cont,
            quickClose: true
        });
        d.show();
        setTimeout(function() {
            d.close().remove();
        }, 2000);
    }
    //提交订单
    function doSubmitOrder(config, bizType) {
        //如果是配送的
        if ($("#psfs").val() == "1") {
            config.toUser = SYSTEM_USERID;
	            config.pojo = {
	            receiver: addrInfo.addressee,
	            reMobile: addrInfo.mobile,
	            reAddress: addrInfo.province + addrInfo.city + addrInfo.district + addrInfo.detailAddress,
	            applyUser: sessionStorage.getItem("userId"),
	            applyNote: $("#apply_note").val() || "",
	            companyCode: SYSTEM_CODE,
	            systemCode: SYSTEM_CODE
	        };
            
            //自提的方式
        } else {
            config.toUser = $("#seller").val();
            config.addressCode = "";
            if (!config.toUser) {
                showMsg("商家不能为空");
                return;
            }
            config.pojo = {
	            receiver: "",
	            reMobile: "",
	            reAddress: "",
	            applyUser: sessionStorage.getItem("userId"),
	            applyNote: $("#apply_note").val() || "",
	            companyCode: SYSTEM_CODE,
	            systemCode: SYSTEM_CODE
	        };
        }
        
        //提交订单
        Ajax.post(bizType, {json: config})
            .then(function(response) {
                if (response.success) {
                    var code = response.data || response.data.code;
                    location.href = './pay_order.html?code=' + code;
                } else {
                    showMsg(response.msg);
                }
            });
    }
});
