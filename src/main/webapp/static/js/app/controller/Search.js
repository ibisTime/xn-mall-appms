define([
    'app/controller/base',
    'app/util/ajax',
    'Handlebars'
], function (base, Ajax, Handlebars) {
    $(function () {
		var url = APIURL + "",
			tplCont = __inline("../ui/search-list.handlebars"),
			sVal = base.getUrlParam("s") || "",
			first = true, isEnd = false, canScrolling = false,
			searchConfig = {
				limit: 10,
				start: 1
			}, searchUrl = APIURL + '/commodity/queryPageModel';
		
		initView();
		
        function initView(){
			addListeners();
			if(sVal){
				$("#searchInput").val(sVal);
				$("#searchIcon").click();
			}
		}
    	function addListeners(){
    		//搜索按钮
    		$("#searchIcon").on("click", function(){
    			var vv = $("#searchInput").val();
    			if(vv = vv && vv.trim()){
    				sVal = vv;
    				first = true;
    				isEnd = false;
    				searchConfig.start = 1;
    				canScrolling = false;
    				$("#searchUl").empty();
    				doSearch();
    			}
    		});
    		//页面下拉加载数据
    		$(window).on("scroll", function(){
	        	var me = $(this);
	        	if( canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop()) ){
	        		canScrolling = false;
	        		doSearch();
	        	}
	        });
    	}
    	function doSearch(){
			addLoading();
			searchConfig.modelName = sVal;
			Ajax.get(searchUrl, searchConfig, true)
                .then(function (res) {
                    if(res.success){
                        var data = res.data,
                        	list = data.list;
                        if(+data.totalCount <= searchConfig.limit || list.length < searchConfig.limit){
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
                        		}
							    html += '</div></a></li>';
                        	});
							removeLoading();
							$("#searchUl").append(html);
							searchConfig.start += 1;
                        }else{
                        	if(first){
	                    		doError("没有相关商品");
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
    	function addLoading(){
    		$("#searchUl").html('<li class="scroll-loadding"></li>');
    	}
        function doError(msg) {
        	msg = msg || "暂时无法获取商品信息";
            $("#searchUl").html('<li class="bg_fff" style="text-align: center;line-height: 150px;">'+msg+'</li>');
        }
        function removeLoading(){
	    	$("#searchUl").find(".scroll-loadding").remove();
	    }
    });
});