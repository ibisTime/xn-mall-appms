define([ 'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'app/util/dict',
    'app/module/loading/loading'
], function(base, Ajax, dialog, dict, loading) {
    $(function () {
        var code = base.getUrlParam("code");
        var times = base.getUrlParam("times");
        var fromCurrency = base.getUrlParam("fromCurrency");
        var moneyOne = base.getUrlParam("moneyOne");
        var rmbRemain = 0,CGBRemain = 0,jfRemain = 0;

        var totalMoney = times*moneyOne;
        $(".times").text(times);
        $(".totalMoney").text(base.formatMoneyD(totalMoney));
        init();
        function init(){
        	getAccount()
        }
        
        function getAccount(){
	        return Ajax.get("802503", {
	            userId: base.getUserId()
	        }).then(function(res){
	            if(res.success){
	                var data = res.data;
	                data.forEach(function(d, i){
	                    if(d.currency == "CNY"){
	                        rmbRemain = base.formatMoneyD(d.amount);
	                    }else if(d.currency == "CGB"){
	                        CGBRemain = base.formatMoneyD(d.amount)
	                    }else if(d.currency == "CGJF"){
	                        jfRemain = base.formatMoneyD(d.amount)
	                    }
	                })
	                
            		addListener();
	            }
	        });
	    }
        
        function addListener() {

            if(fromCurrency == "CNY"){
            	var  html = "";
                html += '<div class="b_bd_tb ptb10  bg_fff p_r s_12"><img src="/static/images/余额.png" class="va-m wp22p ml10">'+
					'<span class="pl4 inline_block va-m">余额支付(余额：<span id="rmbRemain">￥'+rmbRemain+'</span>)</span>'+
					'<input checked class="ab ab_r20 buyWay"  value="yePay" type="radio" name="buy"/></div>'+
					'<div class="b_bd_tb ptb10  bg_fff p_r s_12">'+
					'<img src="/static/images/weixin-qq-icon.png" class="va-m wp22p ml10">'+
					'<span class="pl4 inline_block va-m">微信支付</span>'+
					'<input class="ab  ab_r20 buyWay" value="wxPay" type="radio" name="buy"/></div>';

                $(".MoneyType").text("元");
                $(".payWaysWrap").append(html)
            }else if(fromCurrency == "CGB"){

            	var  html = "";
                html +='<div class="b_bd_tb ptb10  bg_fff p_r s_12"><img src="/static/images/余额.png" class="va-m wp22p ml10">'+
    				'<span class="pl4 inline_block va-m">余额支付(余额：<span id="rmbRemain">'+CGBRemain+'菜狗币</span>)</span><input checked class="ab ab_r20 buyWay"  value="yePay" type="radio" name="buy"/></div>';
                
                $(".MoneyType").text("菜狗币");
                $(".payWaysWrap").append(html)
            }else{
                var  html = "";
                html +='<div class="b_bd_tb ptb10  bg_fff p_r s_12"><img src="/static/images/余额.png" class="va-m wp22p ml10">'+
    				'<span class="pl4 inline_block va-m">余额支付(余额：<span id="rmbRemain">'+jfRemain+'抵金券</span>)</span><input checked class="ab ab_r20 buyWay"  value="yePay" type="radio" name="buy"/></div>';
    				
                $(".MoneyType").text("抵金券");
                $(".payWaysWrap").append(html)
            }
            html = $(html)
            var payType;
            $("#toPay").on("click",function () {
                var buyWay = $("body").find(".buyWay:checked").val();
                // $("#toPay").css("id").remove()
				
                if(buyWay == "wxPay"){
                    payType = 5;
                }else if(buyWay == "yePay"){
                    payType = 90;
                }else{
                    base.showMsg("请选择支付方式");
                }
                
            	var userId =  sessionStorage.getItem("userId");
            	Ajax.getIp()
                    .then(function (res) {
                        var param = {
                            "userId": userId,
                            "jewelCode": code,
                            "times":times,
                            "payType": payType,
                            "ip": res.ip
                        };


                        Ajax.post('615020', {json:param})
                            .then(function (response) {
                                if (response.success) {

                                    if(payType == 5 ){
                                        wxPay(response)
                                    }else{
                                        base.showMsg("支付成功");
                                        setTimeout(function(){
                                        	location.href = '../indiana/indiana.html'
                                        },800)
                                        
                                    }

                                } else {
                                    if(fromCurrency=="CGJF" && response.msg=="账户余额不足"){
					                	base.confirm("抵金券余额不足，是否前往兑换？","否","是").then(function(){
					                		
					                        location.href = "../user/buyIntegral.html";
					                	},function(){
					                        
					                	})
					                }else if(fromCurrency=="CNY" && response.msg=="账户余额不足"){
					                	base.confirm("账户余额不足，是否前往充值？","否","是").then(function(){
					                		
					                        location.href = "../pay/cny_recharge.html";
					                	},function(){
					                        
					                	})
					                }else if(fromCurrency=="CGB" && response.msg=="账户余额不足"){
					                	base.confirm("菜狗币余额不足，是否前往充值？","否","是").then(function(){
					                		
					                        location.href = "../pay/buyCgM.html";
					                	},function(){
					                        
					                	})
					                }else{
					                	base.showMsg(response.msg);
					                }
                                }
                            });

                    })
                })


            var response = {};
            function onBridgeReady() {
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        "appId": response.data.appId, //公众号名称，由商户传入
                        "timeStamp": response.data.timeStamp, //时间戳，自1970年以来的秒数
                        "nonceStr": response.data.nonceStr, //随机串
                        "package": response.data.wechatPackage,
                        "signType": response.data.signType, //微信签名方式：
                        "paySign": response.data.paySign //微信签名
                    },
                    function(res) {
                        loading.hideLoading();
                        // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                            base.showMsg("支付成功");
                            setTimeout(function() {
                                location.href = "../indiana/detail.html?code="+code;
                            }, 1000);
                        } else {
                            base.showMsg("支付失败");
                        }
                    }
                );
            }

            function wxPay(response1) {
                response = response1;
                if (response.data && response.data.signType) {
                    if (typeof WeixinJSBridge == "undefined") {
                        if (document.addEventListener) {
                            document.removeEventListener("WeixinJSBridgeReady", onBridgeReady);
                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                        } else if (document.attachEvent) {
                            document.detachEvent('WeixinJSBridgeReady', onBridgeReady);
                            document.detachEvent('onWeixinJSBridgeReady', onBridgeReady);
                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                        }
                    } else {
                        onBridgeReady();
                    }
                } else {
                    loading.hideLoading();
                    base.showMsg(data.msg || "微信支付失败");
                }
            }






        }

    });
});
