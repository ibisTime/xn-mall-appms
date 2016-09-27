define([
    'app/controller/base',
    'app/util/ajax',
    'Handlebars'
], function (base, Ajax, Handlebars) {
    $(function () {
        var first = true,
	        isEnd = false,
	        canScrolling = true;
		var category = base.getUrlParam("c") || "",
			productCode = base.getUrlParam("pc") || "",
			type = base.getUrlParam("t") || "";
        var config = {
				limit: 10,
				start: 1,
				category: category,
				type: type,
				productCode: productCode
			}, url = APIURL + '/commodity/queryPageModel';

		init();
        function init(){
			queryPageModel();
			addListeners();
		}
        function queryPageModel(){
        	Ajax.get(url, config, true)
                .then(function (res) {
                    if(res.success){
                        var data = res.data,
                        	list = data.list;
                        if(+data.totalCount < config.limit || list.length < config.limit){
	                    	isEnd = true;
	                    }
                        if(list.length){
                        	var html = "";
                        	list.forEach(function(d){
                        		var price = +d.discountPrice / 1000;
								var model = d.model;
                        		html += '<li class="ptb8 clearfix b_bd_b">'+
						        	'<a class="pl12 show clearfix" href="../operator/buy.html?code='+model.code+'">'+
							            '<div class="fl wp30 tc"><img src="'+model.pic1+'"/></div>'+
							            '<div class="fl wp70 pl12">'+
							                '<p class="t_323232 s_12 line-tow">'+model.name+'</p>'+
							                '<p class="t_999 s_10 line-tow">'+model.productName+'</p>'+
							                '<p class="t_red">'+price.toFixed(0)+'<span class="s_10 t_40pe pl4">积分</span>';
                        		if(d.cnyPrice){
                        			html += "+" + (+d.cnyPrice / 1000).toFixed(2)+'<span class="s_10 t_40pe pl4">元</span></p>';
                        		}else{
									html += '</p>';
								}
								if(d.originalPrice){
									html += '<p class="s_10">市场参考价：<span>'+(+d.originalPrice / 1000).toFixed(2)+'</span>元</p>';
								}
							    html += '</div></a></li>';
                        	});
							removeLoading();
                            $("#contUl").append(html);
	                        config.start += 1;
                        }else{
                        	if(first){
	                    		doError();
	                    	}else{
	                    		removeLoading();
	                    	}
                        }
                    }else{
                    	if(first){
                    		doError();
                    	}else{
                    		removeLoading();
                    	}
	                }
	                first = false;
	                canScrolling = true;
                });
        }
        
        function addListeners(){
        	$(window).on("scroll", function(){
	        	var me = $(this);
	        	if( canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop()) ){
	        		canScrolling = false;
	        		addLoading();
	        		queryPageModel();
	        	}
	        });
        	$("#searchIcon").on("click", function(){
        		var sVal = $("#searchInput").val().trim();
        		sVal = decodeURIComponent(sVal);
        		location.href = "./search.html?s=" + sVal;
        	});
        }
        function doError() {
            $("#contUl").html('<li class="bg_fff" style="text-align: center;line-height: 150px;">暂无相关商品信息</li>');
        }
        
	    function addLoading() {
	        $("#contUl").append('<li class="scroll-loadding"></li>');
	    }

	    function removeLoading(){
	    	$("#contUl").find(".scroll-loadding").remove();
	    }
    });
});