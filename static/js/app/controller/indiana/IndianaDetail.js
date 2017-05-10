define([ 'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'app/util/dict',

], function(base, Ajax, dialog, dict) {
    var userId = base.getUserId();
    var maxNum = 0;
    var detail =  base.getUrlParam("d");

    init();

    function init() {
		
		$(".close").click(function(){
			$(".Mpopup").css("display","none")
		})
		if(detail){
			$(".ifBuyed").hide();
			$(".ifBuyedDiv").hide();
			
		}
		
        // 进度条meter的值获取及设置

        // 数量加减逻辑

        $(".introduce").on("click", function () {
            location.href = "introduce.html"
        })

        var code = base.getUrlParam("code");
        var param = {
            "code":code
        };
		
		$.when(
			Ajax.post('615016', {json:param}),
			base.getSysConfig("807717","treasure_statement"),
			base.getDictList("802006","currency")
		).then(function (response,res1,res2) {
                if (response.success && res1.success && res2.success) {	
                	
                    $(".MZContent").html(res1.data.note);
                    
                    var distRes = res2.data;
                    
                    data= response.data;
                    var moneyOne =  data.fromAmount;
                    var surplus = data.totalNum - data.investNum;
                    var fromCurrency = data.fromCurrency;
                    var templateCode = data.templateCode;
                    maxNum = data.maxNum;
                    // var jewelCode =data.jewelCode;
                $(".indianaDetail-banner").find("img").attr("src",PIC_PREFIX + data.advPic);
                    if(data.toCurrency == "CNY"){
                        var toAmount = base.formatMoneyD(data.toAmount) +"元";
                    }else if(data.toCurrency == "CGB"){
                        var toAmount = base.formatMoneyD(data.toAmount) +"菜狗币";
                    }else{
                        var toAmount = base.formatMoneyD(data.toAmount) +"积分";
                    }
                    if(data.fromCurrency == "CNY"){
                        $(".money .MoneyType").text("元")
                    }else if(data.fromCurrency == "CGB"){
                        $(".money .MoneyType").text("菜狗币")
                    }else{
                        $(".money .MoneyType").text("积分")
                    }
                    
                    $(".indianaDetail_1").find(".span").text(toAmount);
                    $(".indianaDetail_1").find(".slogan").text(data.slogan);
                    $(".indianaDetail_2").find(".maxNum").html("单人最大投资<i>"+maxNum+"</i>次");
                    
                    $(".indianaDetail_2").find("span").text(data.periods);
                    $(".indianaDetail_4").find(".total").text(data.totalNum);
                    $(".indianaDetail_4").find(".surplus").text(surplus);
                    var maxVal =data.totalNum;
                    var Val =data.investNum
                    var percent =(Val/maxVal)*100;
                    $(".wrapDiv").find("div").css("width",+percent+"%")
                    // $("meter").attr({max:data.totalNum,value:data.investNum});


                    $(".history").on("click", function () {
                        location.href = "history.html?templateCode="+templateCode;
                    })
                    var num = $(".i").text();
                    var totalMoney = moneyOne;
                    $(".money .totalMoney").text(base.formatMoneyD(totalMoney))
                    $(".max").on("click",function () {
                        if(surplus <maxNum){
	                        $(".i").text(surplus);
	                        num = surplus;
	                        totalMoney = num * moneyOne;
	                        $(".money .totalMoney").text(base.formatMoneyD(totalMoney))
                        }else{
                            num = maxNum;
                            totalMoney = num * moneyOne;
                            $(".i").text(maxNum);
                            $(".money .totalMoney").text(base.formatMoneyD(totalMoney))
                        }
                    });

                    $(".sub").on("click",function () {
                        if(num<=1){
                            num = 1;
                        }else{
                            num --;
                        }
                        $(".i").text(num);
                        totalMoney = num * moneyOne;
                        $(".money .totalMoney").text(base.formatMoneyD(totalMoney))
                    });
                    $(".add").on("click",function () {
                        //            debugger
                        if(num >= surplus || num >= maxNum){
                            num = Math.min(surplus, maxNum)
                        }else{
                            num ++;
                        }
                        $(".i").text(num);
                        totalMoney = num * moneyOne;
                        $(".money .totalMoney").text(base.formatMoneyD(totalMoney))
                    })

                    $(".toJion").on("click",function () {
                        if(userId){
                            $(".MZSM").css("display","block")
                            $(".MZSM button").on("click",function () {
                                location.href = "../pay/pay.html?code="+data.code+"&times="+num +"&fromCurrency="+fromCurrency+"&moneyOne="+moneyOne;
                            })
                        }else{
                           returnUrl = "../indianaDetail.html";
                            location.href = "../user/login.html?return="+encodeURIComponent(location.pathname + location.search);
                        }


                    })
                    var param1 = {
                        "companyCode": COMPANYCODE,
                        "start": "1",
                        "limit": "20",
                        "status":"123",
                        "jewelCode": code
                    }
                    Ajax.post("615025",{json:param1})
                        .then(function (res) {
                            if (res.success){
                                var lists = res.data.list;
                                var data = "";
                                var html = "";
                                
                                for (var i = 0; i <lists.length ; i++) {
                                	var val = lists[i];
                                	var s = "";
                                	var payDatetime =val.payDatetime;
                                    if($(".indianaRecord_name span").text() !== ""){
                                        $(".indianaRecord_name span").text("("+payDatetime+"开始）")
                                    }
                                    var dataTime = val.payDatetime.substring(0,10),
                						mobile = val.user.mobile.substring(0, 3) + "*****" +  val.user.mobile.substring(8, 11),
	                                    times = val.times,
	                                    ip = val.ip,
	                                    payDatetime = val.payDatetime;
                                    
                                    var dpartakTxt1 = '参与<i class="result">'+times+'</i>次夺宝';
									var dpartakTxt2 = '中了<i class="result">'+(val.jewel.toAmount)/1000+dictArray(val.jewel.toCurrency,distRes)+'</i>大奖';
								
                                    if(data !== dataTime){
                                        s +="<div class='time'><p class='pz9'>"+dataTime+"</p><div class='d-hr'></div></div>";
                                        data = dataTime;
                                    }
                                	
                                	s += '<div class="li"><div class="detail"><div class="d-hr"></div>';
                                	s += '<div class="img pz9"><img src="/static/images/defaultImg.png" alt=""></div>';
				                	s += '<div class="personInfo"><p class="name">'+mobile+'</p>';
				                    s += '<p class="ip"><span>'+ip+'</span></p>';
				                    if(val.status == 2){
				                    	var s1 = s;
				                    	
										s += '<p class="ifGet"><span>'+dpartakTxt2+'</span>';
										s += '<span class="data">'+payDatetime+'</span></p></div></div></div>';
										s += s1;
										
									}
									
									s += '<p class="ifGet"><span>'+dpartakTxt1+'</span>';
									s += '<span class="data">'+payDatetime+'</span></p></div></div></div>';
									
                                	html += s;
                                }

								$(".indianaDetail_record_detail").append(html);
                            }else{
                                base.showMsg(res.msg)
                            }

                        })
                    $("#cont").hide();

                } else {
                    $("#cont").hide();
                    base.showMsg("暂时无法获取商品详情！");

                }
            });






     }

	function dictArray(dkey,arrayData){//类型
		for(var i = 0 ; i < arrayData.length; i++ ){
			if(dkey == arrayData[i].dkey){
				return arrayData[i].dvalue;
			}
		}
	}
});