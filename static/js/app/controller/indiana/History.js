define([ 'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'app/util/dict',
    'lib/iscroll'
], function(base, Ajax, dialog, dict,IScroll) {
    $(function () {
        var templateCode = base.getUrlParam("templateCode");
        var start=1,limit=10;
        var isEnd = false,
            canScrolling = false;
        init();
        function init() {
            addListener();
            
            $(".indianaDetail").on("click","li",function() {
            	var code = $(this).attr("data-code");
                location.href = "./detail.html?code=" + code + "&&d=1";
            })
        }

		//页面下拉加载
        $(window).on("scroll", function() {
            // var me = $(this);
            if (canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())) {
                canScrolling = false;
                addLoading();
                addListener();
            }
        });

        function addListener() {
            var param ={
                "templateCode":templateCode,
                "companyCode": COMPANYCODE,
                "status": "1",
                "start": start,
                "limit": limit,

            };
            Ajax.post("615015",{json:param})
                .then(function (res) {
                    if(res.success){
                        var lists = res.data.list;
                        var totalCount = +res.data.totalCount
                        if (totalCount <= limit || lists.length < limit) {
                            isEnd = true;
                        }
                        
                        var html="";
	                    for(var i = 0; i <lists.length ; i++){
	                    	var val = lists[i];
	                    	
	                    	if(val.status==1){
	                    		var s="";
	                        	var surplus = val.totalNum - val.investNum;
	                        	
	                            if (val.toCurrency == "CNY") {
	                                var toAmount = val.toAmount / 1000 + "元"
	                            } else if (val.toCurrency == "CGB") {
	                                var toAmount = val.toAmount / 1000 + "菜狗币"
	                            } else {
	                                var toAmount = val.toAmount / 1000 + "积分"
	                            }
	                            
	                            var maxVal = val.totalNum;
	                            var Val = val.investNum
	                            var percent = Val / maxVal * 1.55;
	                            s += '<li data-code="'+val.code+'"><div class="indiana-num">第<span id="periods">' + val.periods + '</span>期</div>';
						        s += '<div class="indiana-has"><span id="toAmount">'+ toAmount + '</span><div class="wrapDiv"><div style="width:'+percent+'rem;"></div></div></div>';
						        s += '<div class="indiana-person"><p>总需人次</p><p class="num" id="totalNum">' + val.totalNum + '</p></div>';
						        s += '<div class="indiana-last"><p>剩余人次</p><p class="num">' + surplus + '</p></div>';
						        s += '<div class="indiana-price"><p>单价</p><p class="num" id="fromAmount">' + val.fromAmount / 1000 + '</p></div></li>';
	                            
	                            html += s;
	
	                            removeLoading();
	                    	}
	                        
	                    }
	                    
                        $(".indianaDetail").append(html);
                        $(".indianaDetail li:nth-child(3n+1)").addClass("bg_1");
                        $(".indianaDetail li:nth-child(3n+2)").addClass("bg_2");
                        $(".indianaDetail li:nth-child(3n)").addClass("bg_3");
                        start++
                    }
                    canScrolling = true;
                })
        }

        function addLoading() {
            $(".indianaDetail").append('<p class="scroll-loadding"></p>');
        }

        function removeLoading() {
            $(".indianaDetail").find(".scroll-loadding").remove();
        }


        function showMsg(cont){
            var d = dialog({
                content: cont,
                quickClose: true
            });
            d.show();
            setTimeout(function () {
                d.close().remove();
            }, 2000);
        }
    })
});