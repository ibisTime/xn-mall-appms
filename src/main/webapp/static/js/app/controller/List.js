define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
	'app/util/dict',
    'Handlebars'
], function (base, Ajax, dialog, dict, Handlebars) {
    $(function () {
    	var url = APIURL + '/user/business/page',
			type = base.getUrlParam("t") || "",
			conTypes = dict.get("consumeType"),
    		config = {
				type: type,
    			province: "",
    	        city: "",
				area: "",
				limit: 15,
    	        start: 1,
    	        orderDir: "desc",
    	        orderColumn: "totalDzNum"
    	    }, first = true, isEnd = false, canScrolling = false,
			contentTmpl = __inline("../ui/consume.handlebars");

		if(sessionStorage.getItem("user") !== "1"){
            location.href = "../user/login.html?return=" + encodeURIComponent(location.pathname + location.search);
        }else{
            initView();
        }

	    function initView() {
			addLoading();
			addTypes();
			businessPage();
	        addListeners();
	    }
		
		function addTypes(){
			$("#lTypes").find("span").text(conTypes[type] || "");
			var html = "";
			for(var n in conTypes){
				html += '<li l-type="'+n+'">'+conTypes[n]+'</li>';
			}
			$("#consumeUl").html(html);
		}

	    function addListeners() {
			//点赞
			$("#consume-ul").on("click", ".good-div", function(){
				praise(this);
			});
			//下拉加载
			$(window).on("scroll", function(){
	        	var me = $(this);
	        	if( canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())
					//列表下拉框未显示时才加载
					&& $("#mask").hasClass("hidden") ){

	        		canScrolling = false;
	        		addLoading();
	        		businessPage();
	        	}
	        });
			//搜索
			$("#searchInput").on("keyup", function(){
				var sVal = $(this).val();
				if(!sVal || sVal.trim() === ""){
					$("#searchUl").addClass("hidden").empty();
				}else{
					base.throttle(searchBusiness, this, 150);
				}
			});
			//类型选择按钮
			$("#lTypes").on("click", function(){
				$("#mask, #cListDiv").removeClass("hidden");
			});
			//类型选择列表（酒店、周边游等）
			$("#consumeUl").on("click", "li", function(){
				config.type = $(this).attr("l-type");
				$("#lTypes").find("span").text(conTypes[config.type]);
				doAreaOrTypeChose();
			});
			//选择区域按钮
			$("#lAreas").on("click", function(){
				$("#mask, #cAreaDiv").removeClass("hidden");
			});
			//区域选择列表
			$("#consumeAreaUl").on("click", "li", function(){
				config.area = $(this).text();
				$("#lAreas").find("span").text(config.area);
				doAreaOrTypeChose();
			});
			//点击覆盖层时，隐藏下拉列表
			$("#mask").on("click", function(){
				hideMaskAndUl();
			})
	    }
		//重新选择区域或类型后重新加载
		function doAreaOrTypeChose(){
			canScrolling = false;
			isEnd = false;
			first = true;
			$("#consume-ul").empty();
			addLoading();
			businessPage();
			hideMaskAndUl();
		}
		//隐藏列表
		function hideMaskAndUl(){
			$("#mask, #cListDiv, #cAreaDiv").addClass("hidden");
		}
		//搜索商家
		function searchBusiness(){
			var sConfig = {
					province: config.province,
					city: config.city,
					area: config.area,
					type: config.type,
					name: this.value,
					limit: 10,
					start: 1,
					orderDir: "desc",
					orderColumn: "totalDzNum"
				};
			Ajax.post(url, sConfig)
	            .then(function (response) {
	                if (response.success) {
						var html = "", curList = response.data.list;
						if(curList.length){
							curList.forEach(function(item){
								html += '<li><a href="./detail.html?c='+item.code+'">'+item.name+'</a></li>';
							});
							$("#searchUl").removeClass("hidden").html(html);
						}
					}
				});
		}
	    //点赞
	    function praise(me){
			var $me = $(me),
				code = $me.closest("li[code]").attr("code"),
				span = $me.find("span");
			$("#loaddingIcon").removeClass("hidden");
	    	Ajax.post(APIURL + "/user/praise", {toMerchant: code})
	            .then(function (response) {
					$("#loaddingIcon").addClass("hidden");
	                if (response.success) {
						span.text(+span.text() + 1);
					}else{
						showMsg("非常遗憾，点赞失败!");
					}
				});
	    }
	    //分页查询商家
	    function businessPage(){
	    	Ajax.post(url, config)
	            .then(function (response) {
	                if (response.success) {
	                    var data = response.data,
	                    	totalCount = +data.totalCount,
	                    	curList = data.list;
	                    if(totalCount <= config.limit || curList.length < config.limit){
	                    	isEnd = true;
	                    }
	                    if(curList.length){
	                        $("#consume-ul").append( contentTmpl({items: curList}) );
	                        removeLoading();
	                        config.start += 1;
	                    }else{
	                    	judgeError();
	                    }
	                }else{
	                	judgeError();
	                }
	                first = false;
	                canScrolling = true;
	            });
	    }
	    //处理异常情况
		function judgeError(){
			if(first){
				doError();
			}else{
				removeLoading();
			}
		}
		//添加下拉加载时的loading图标
	    function addLoading() {
	        $("#consume-ul").append('<li class="scroll-loadding"></li>');
	    }
		//移除下拉加载时的loading图标
	    function removeLoading(){
	    	$("#consume-ul").find(".scroll-loadding").remove();
	    }
		
	    function doError() {
            $("#consume-ul").html('<li style="text-align: center;line-height: 93px;">暂时无法获取商家信息</li>');
        }
	    
	    function showMsg(cont, time){
    		var d = dialog({
				content: cont,
				quickClose: true
			});
			d.show();
			setTimeout(function () {
				d.close().remove();
			}, time || 2000);
    	}
    });
});