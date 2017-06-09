define([ 'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'app/util/dict'
], function(base, Ajax, dialog, dict) {
    // var param = base.getUrlParam("param1");
    // console.log(param)
    var start = 1,limit =50;
    var isEnd = false,
        canScrolling = false;
    init();
    function init() {
        addListener();
    }
    $(window).on("scroll", function() {
        if (canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())) {
            canScrolling = false;
            addLoading();
            addListener();
        }
    });
    function addListener() {
    	var param = {
          "companyCode": COMPANYCODE,
          "start": start,
          "limit": limit
    	}
    	
 		$.when(
        	Ajax.post("615025",{json:param}),
        	base.getDictList("802006","currency")
        ).then(function(res,res1) {
            if (res.success && res1.success) {
            	
				var distRes = res1.data;
                    lists = res.data.list;
                var totalCount = +res.data.totalCount;
                if (totalCount <= limit || lists.length < limit) {
                    isEnd = true;
                }
                var html="";
                for(var i = 0; i <lists.length ; i++){
                	var val = lists[i];
                	
                	if(val.status != 0){
                		var mobile = val.user.loginName;
	                    var times = val.times;
	                    var hs ="";
	                    
	                    hs += '<p class="ptb4"><span class="indianaType">参与</span><span class="mobile">' + mobile + '</span>参与<span class="indianaInfo">' + times + '</span>次夺宝</p>';
	                    if(val.status == 2){
	                    	hs += '<p class="ptb4"><span class="indianaType">中奖</span><span class="mobile">' + mobile + '</span>中得<span class="indianaInfo">' + val.jewel.toAmount/1000 + dictArray(val.jewel.toCurrency,distRes)+'</span></p>';
	                    }
	                    
                   		html += hs;
                	}
                	
                }
                removeLoading();
                $(".secord").append(html);
                
                start++
            }
            canScrolling = true;

        })
    }
    
    function addLoading() {
        $(".secord").append('<p class="scroll-loadding"></p>');
    }

    function removeLoading() {
        $(".secord").find(".scroll-loadding").remove();
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
    
    function dictArray(dkey,arrayData){//类型
		for(var i = 0 ; i < arrayData.length; i++ ){
			if(dkey == arrayData[i].dkey){
				return arrayData[i].dvalue;
			}
		}
	}
});