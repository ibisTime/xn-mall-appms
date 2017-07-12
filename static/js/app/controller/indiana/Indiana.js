define([
    'app/controller/base', 'app/util/ajax', 'app/util/dialog', 'lib/iscroll'
], function(base, Ajax, dialog, IScroll) {
    var start = 1,
        limit = 15;
    var isEnd = false,
        canScrolling = false;
    init()

    function init() {
        addListener();
    }
    
    function addListener() {
        $(window).on("scroll", function() {
            //列表下拉框未显示时才加载
            if (canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())) {
                canScrolling = false;
                addLoading();
                loadingSecord();
            }
        });
        loadingSecord();
        $(".indianaDetail").on("click","li",function() {
        	
            location.href = "./detail.html?code=" + $(this).attr("data-code");
        })
        
        
        function loadingSecord() {

            var param = {
                "companyCode": COMPANYCODE,
                "start": start,
                "limit": limit,
                "status": 0,
			    "orderDir": "desc",
            };
            
            Ajax.post('615015', {json: param}).then(function(response) {
                if (response.success) {

                    lists = response.data.list;
                    var totalCount = +response.data.totalCount;
                    if (totalCount <= limit || lists.length < limit) {
                        isEnd = true;
                    }
                    
                    var html="";
                    for(var i = 0; i <lists.length ; i++){
                    	var val = lists[i];
                    	
                		var s="";
                    	var surplus = val.totalNum - val.investNum;
                    	
                        if (val.toCurrency == "CNY") {
                            var toAmount = val.toAmount / 1000 + "元"
                        } else if (val.toCurrency == "CGB") {
                            var toAmount = val.toAmount / 1000 + "菜狗币"
                        } else {
                            var toAmount = val.toAmount / 1000 + "抵金券"
                        }
                        
                        var maxVal = val.totalNum;
                        var Val = val.investNum
                        var percent = Val / maxVal * 1.55;
                        var code = val.code;
                        s += '<li data-code="'+code+'"><div class="indiana-num">第<span id="periods">' + val.periods + '</span>期</div>';
				        s += '<div class="indiana-has"><span id="toAmount">'+ toAmount + '</span><div class="wrapDiv"><div style="width:'+percent+'rem;"></div></div></div>';
				        s += '<div class="indiana-person"><p>总需人次</p><p class="num" id="totalNum">' + val.totalNum + '</p></div>';
				        s += '<div class="indiana-last"><p>剩余人次</p><p class="num">' + surplus + '</p></div>';
				        s += '<div class="indiana-price"><p>单价</p><p class="num" id="fromAmount">' + val.fromAmount / 1000 + '</p></div></li>';
                        
                        html += s;

                        removeLoading();
                        
                    }
                    
                    $(".indianaDetail").append(html);
                    
                    $(".indianaDetail li:nth-child(3n+1)").addClass("bg_1");
                    $(".indianaDetail li:nth-child(3n+2)").addClass("bg_2");
                    $(".indianaDetail li:nth-child(3n)").addClass("bg_3");
                    $("#cont").hide();
                    start++
                } else {
                    $("#cont").hide();
                    showMsg("暂时无法获取一元列夺宝列表信息！");
                }
                canScrolling = true;
            });

        }

        var param1 = {
            "companyCode": COMPANYCODE,
            "start": "1",
            "limit": "0",
            "status":"123"
        };
        $.when(
        	Ajax.post("615025", {json: param1}),
        	base.getDictList("802006","currency")
        ).then(function(res,res1) {
            if (res.success && res1.success) {
            	
				var distRes = res1.data;
                lists = res.data.list;
                
                var htmlSecord="";
                for(var i = 0; i <lists.length ; i++){
                	var val = lists[i];
                	
                	if(val.status != 0){
                		var mobile = val.user.mobile;
                		mobile = mobile.substring(0, 3) + "*****" + mobile.substring(8, 11);
	                    var times = val.times;
	                    var hs ="";
	                    
	                    hs += '<p><span class="indianaType">参与</span><span class="mobile">' + mobile + '</span>参与<span class="indianaInfo">' + times + '</span>次夺宝</p>';
	                    
	                    if(val.status == 2){
	                    	hs += '<p><span class="indianaType">中奖</span><span class="mobile">' + mobile + '</span>中得<span class="indianaInfo">' + val.jewel.toAmount/1000 + dictArray(val.jewel.toCurrency,distRes)+'</span></p>';
	                    }
	                    
                   		htmlSecord += hs;
                	}
                	
                }
                $(".record_1").append(htmlSecord);

                var record = $('.record')[0];
                var record_1 = $('.record_1')[0];
                var record_2 = $('.record_2')[0];
                record.scrollTop = 0;
                
                // 克隆
                if(lists.length>3){
                	record_2.innerHTML = record_1.innerHTML;
                	function myScroll() {
	                    if (record.scrollTop >= record_1.scrollHeight) {
	                        record.scrollTop = 0;
	                    } else {
	                        record.scrollTop += 2;
	                    }
	                }
	                var time = 100;
	                setInterval(myScroll, time);
                }

            } else {

                showMsg(res.msg)
            }
        })
        $(".record_1").on("click", function() {
            location.href = "./recordLists.html"
        })

    }

    //页面下拉加载

    function addLoading() {
        $(".indianaDetail").append('<p class="scroll-loadding"></p>');
    }

    function removeLoading() {
        $(".indianaDetail").find(".scroll-loadding").remove();
    }

    function showMsg(cont) {
        var d = dialog({content: cont, quickClose: true});
        d.show();
        setTimeout(function() {
            d.close().remove();
        }, 2000);
    }
	
	function dictArray(dkey,arrayData){//类型
		for(var i = 0 ; i < arrayData.length; i++ ){
			if(dkey == arrayData[i].dkey){
				return arrayData[i].dvalue;
			}
		}
	}
});
