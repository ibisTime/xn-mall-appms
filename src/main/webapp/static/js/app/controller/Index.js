define([
    'app/controller/base',
    'app/util/ajax',
    'Handlebars',
    'app/util/dict',
    'lib/swiper-3.3.1.jquery.min'
], function (base, Ajax, Handlebars, dict) {
    $(function () {
        var indexTopImg = dict.get("indexTopImg");
        //banner图
        (function(){
            var html = '';
            indexTopImg.forEach(function(d){
                html += '<div class="swiper-slide"><img class="wp100" src="'+d+'"></div>';
            });
            $("#top-swiper").html(html);
            var mySwiper = new Swiper ('.swiper-container', {
                'direction': 'horizontal',
                'loop': true,
                'autoplay': 2000,
                'autoplayDisableOnInteraction': false,
                // 如果需要分页器
                'pagination': '.swiper-pagination'
            });
        })();
        var canScrolling = false, isEnd = false, first = true,
        	config = {
        		"toSite": "2",
                "start": 1,
                "limit": 6
            };
        
        init();
        
        function init(){
            //获取热门推荐
            getRMTJ();
            addListeners();
        }
        
        function addListeners(){
        	$(window).on("scroll", function(){
	        	var me = $(this);
	        	if( canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop()) ){
	        		canScrolling = false;
	        		addLoading();
	        		getRMTJ();
	        	}
	        });
        	//搜索
        	$("#searchIcon").on("click", function(){
        		var sVal = $("#searchInput").val().trim();
        		sVal = decodeURIComponent(sVal);
        		location.href = "../detail/search.html?s=" + sVal;
        	});
        }

        function getRMTJ(){
            Ajax.get(APIURL + '/commodity/queryPageModel', config, true)
                .then(function (res) {
                    if (res.success) {
                        var data = res.data, curList = data.list,
                        	html = '', totalCount = +data.totalCount;
                        if(totalCount <= config.limit || curList.length < config.limit){
	                    	isEnd = true;
	                    }
                        if (curList.length) {
                            for(var i = 0, len = curList.length; i < len; i+=2){
                                if(i+1 <= len - 1){
                                    html += '<tr><td><a href="../operator/buy.html?code='+curList[i].model.code+'"><img src="'+curList[i].model.pic1+'"/>'+
                                    '<div class="s_11 tl">'+
                                    '<div><span class="t_red">'+(+curList[i].discountPrice / 1000).toFixed(0)+'</span>积分';
                                    if(curList[i].cnyPrice && +curList[i].cnyPrice){
                                    	html += '<span class="plr4">+</span><span class="t_red">'+(+curList[i].cnyPrice / 1000).toFixed(2)+'</span>元';
                                    }
                                    html += '</div>'+
                                    '<div class="s_10">市场参考价：<span>'+(+curList[i].originalPrice / 1000).toFixed(2)+'</span>元</div>'+
                                    '</div></a></td>'+
                                    '<td><a href="../operator/buy.html?code='+curList[i+1].model.code+'"><img src="'+curList[i+1].model.pic1+'"/>'+
                                    '<div class="s_11 tl">'+
                                    '<div><span class="t_red">'+(+curList[i+1].discountPrice / 1000).toFixed(0)+'</span>积分';
                                    if(curList[i+1].cnyPrice && +curList[i+1].cnyPrice){
                                    	html += '<span class="plr4">+</span><span class="t_red">'+(+curList[i+1].cnyPrice / 1000).toFixed(2)+'</span>元';
                                    }
                                    html += '</div>'+
                                    '<div class="s_10">市场参考价：<span>'+(+curList[i+1].originalPrice / 1000).toFixed(2)+'</span>元</div>'+
                                    '</div></a></td></tr>';
                                }else{
                                    html+= '<tr><td><a href="../operator/buy.html?code='+curList[i].model.code+'"><img src="'+curList[i].model.pic1+'"/>'+
                                    '<div class="s_11 tl">'+
                                    '<div><span class="t_red">'+(+curList[i].discountPrice / 1000).toFixed(0)+'</span>积分';
                                    if(curList[i].cnyPrice && +curList[i].cnyPrice){
                                    	html += '<span class="plr4">+</span><span class="t_red">'+(+curList[i].cnyPrice / 1000).toFixed(2)+'</span>元';
                                    }
                                    html += '</div>'+
                                    '<div class="s_10">市场参考价：<span>'+(+curList[i].originalPrice / 1000).toFixed(2)+'</span>元</div>'+
                                    '</div></a>'+
                                    '</td><td></td></tr>';
                                }
                            }
                            removeLoading();
	                        $("#rmtj").append(html);
	                        config.start += 1;
                        }else{
                        	if(first){
                        		doError("暂无相关商品");
                        	}else{
                        		removeLoading();
                        	}
                        	isEnd = true;
                        }
                    }else{
                    	if(first){
                    		doError();
                    	}else{
                    		removeLoading();
                    	}
                    	isEnd = true;
                    }
                    first = false;
	                canScrolling = true;
                });
        }
        
        function addLoading() {
	        $("#rmtj").append('<tr><td colspan="2" class="scroll-loadding" style="width:100%;"></td></tr>');
	    }

	    function removeLoading(){
	    	$("#rmtj").find(".scroll-loadding").remove();
	    }

	    function doError(msg) {
	    	msg = msg || "暂时无法获取商品信息";
            $("#rmtj").html('<tr><td colspan="2" style="text-align:center">'+msg+'</td></tr>');
            isEnd = true;
        }
    });
});
