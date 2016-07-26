define([
    'app/controller/base',
    'app/util/ajax',
    'Handlebars'
], function (base, Ajax, Handlebars) {
    $(function () {
        var first = true,
	        isEnd = false,
	        canScrolling = true;
        var config = {
				limit: 10,
				start: 1,
				productCode: base.getUrlParam("pc") || ""
			}, url = APIURL + '/commodity/queryPageModel',
			searchConfig = {
				limit: 10,
				start: 1
			};
        
        function queryPageModel(){
        	Ajax.get(url, config, true)
                .then(function (res) {
                    if(res.success){
                        var data = res.data,
                        	modelSpecsList = data.modelSpecsList;
                        if(data.totalCount < config.limit || modelSpecsList.length < config.limit){
	                    	isEnd = true;
	                    }
                        if(data.length){
                        	var html = "";
                        	data.forEach(function(d){
                        		var buyGuide = d.buyGuideList;
                        		var price = (buyGuide[0] && buyGuide[0].discountPrice) || "--";
                        		html += '<li class="ptb8 clearfix b_bd_b">'+
						        	'<a class="pl12 show clearfix" href="../operator/buy.html?code={{code}}">'+
							            '<div class="fl wp30 tc"><img src="'+d.pic1+'"/></div>'+
							            '<div class="fl wp70 pl12">'+
							                '<p class="t_323232 s_12 line-tow">'+d.name+'</p>'+
							                '<p class="t_999 s_10 line-tow">'+d.description+'</p>'+
							                '<p class="t_red">'+price+'<span class="s_10 t_40pe pl4">积分</span></p>'+
							            '</div>'+
						            '</a>'+
						        '</li>';
                        	});
                            $("#contUl").append(html);
                        	removeLoading();
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
        		var sVal = $("#searchInput").val();
        		if(sVal.trim()){
        			addLoad();
        			first = true;
    	            isEnd = false;
    	            canScrolling = true;
    	            config.start = 1;
    	            config.name = sVal;
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
				searchConfig.name = iValue;
				Ajax.get(url, searchConfig)
					.then(function(res){
						if(res.success){
							var data = res.data.modelSpecsList;
							if(data.length){
								var html = '';
								data.forEach(function(d){
									html += '<li><a class="show" href="../operator/buy.html?code='+ d.code+'">'+ d.name+'</a></li>'
								});
								$("#searchUl").html( html );
							}else{
								noData();
							}
						}else{
							noData();
						}
					});
			}
		}
		function noData(){
			$("#searchUl").html('<li style="text-align: center;">暂无相关商品</li>');
		}
		function addSearchLoading(){
			$("#searchUl").html('<li class="scroll-loadding"></li>');
		}
        function addLoad(){
        	$("#contUl").html('<li class="scroll-loadding"></li>')
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