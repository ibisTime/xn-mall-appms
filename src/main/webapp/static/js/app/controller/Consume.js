define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'Handlebars'
], function (base, Ajax, dialog, Handlebars) {
    $(function () {
    	var url = APIURL + '/user/business/page',
    		config = {
    			province: "",
    	        city: "",
				area: "",
				limit: 15,
    	        start: 1,
    	        orderDir: "desc",
    	        orderColumn: "totalDzNum"
    	    }, first = true, isEnd = false, canScrolling = false,
			contentTmpl = __inline("../ui/consume.handlebars");
    	initView();

	    function initView() {
			$("#myPhone").html('<a style="" href="tel://18868824532">电话</a>');
			businessPage();
	        addListeners();
	    }
	    function addListeners() {
			$("#consume-ul").on(".good-div", "click", function(){
				praise(this);
			});
			$(window).on("scroll", function(){
	        	var me = $(this);
	        	if( canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop()) ){
	        		canScrolling = false;
	        		addLoading();
	        		businessPage();
	        	}
	        });
			$("#searchInput").on("keyup", function(){
				var sVal = $(this).val();
				if(!sVal || sVal.trim() === ""){
					$("#searchUl").addClass("hidden").empty();
				}else{
					base.throttle(searchBusiness, this, 150);
				}
			});
	    }

		function searcBusiness(){
			var sConfig = {
					province: "",
					city: "",
					area: "",
					name: this.value,
					limit: 10,
					start: 1,
					orderDir: "desc",
					orderColumn: "totalDzNum"
				};
			Ajax.post(APIURL + "/business/page", sConfig)
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
	    
		function judgeError(){
			if(first){
				doError();
			}else{
				removeLoading();
			}
		}

	    function addLoading() {
	        $("#consume-ul").append('<li class="scroll-loadding"></li>');
	    }

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