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
			}, url = APIURL + '/commodity/queryPageModel',
			searchConfig = {
				limit: 10,
				start: 1
			}, searchUrl = APIURL + '/commodity/queryPageModel';

		init();
        function init(){
			queryPageModel();
			addListeners();
		}
        function queryPageModel(){
        	Ajax.post(url, config, true)
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
							                '<p class="t_red">'+price+'<span class="s_10 t_40pe pl4">积分</span></p>'+
							            '</div>'+
						            '</a>'+
						        '</li>';
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
			$("#searchInput").on("keyup", function(){
				base.throttle(doSearch, this);
			});
        }
		function doSearch(){
			var iValue = this.value;
			if(iValue.trim()){
				addSearchLoading();
				searchConfig.start = 1;
				searchConfig.modelName = iValue;
				Ajax.post(searchUrl, searchConfig, true)
					.then(function(res){
						if(res.success){
							var data = res.data.list;
							if(data.length){
								var html = '';
								data.forEach(function(d){
									var model = d.model;
									html += '<li><a class="show" href="../operator/buy.html?code='+ model.code+'">'+ model.name+'</a></li>'
								});
								$("#searchUl").html( html );
							}else{
								noData();
							}
						}else{
							noData();
						}
					});
			}else{
				$("#searchUl").empty();
			}
		}
		function noData(){
			$("#searchUl").html('<li style="text-align: center;">暂无相关商品</li>');
		}
		function addSearchLoading(){
			$("#searchUl").html('<li class="scroll-loadding"></li>');
		}
        function doError() {
            $("#contUl").html('<li class="bg_fff" style="text-align: center;line-height: 150px;">暂无数据</li>');
        }
        
	    function addLoading() {
	        $("#contUl").append('<li class="scroll-loadding"></li>');
	    }

	    function removeLoading(){
	    	$("#contUl").find(".scroll-loadding").remove();
	    }
    });
});