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
			contentTmpl = __inline("../ui/consume.handlebars"),
			searchData = {};

		if(sessionStorage.getItem("user") !== "1"){
            location.href = "../user/login.html?return=" + encodeURIComponent(location.pathname + location.search);
        }else{
            initView();
        }
		
	    function initView() {

			if (navigator.geolocation){
				navigator.geolocation.getCurrentPosition(showPosition);
			}

			businessPage();
	        addListeners();
	    }

		function showPosition(position){
			console.log("Latitude: " + position.coords.latitude +
				"Longitude: " + position.coords.longitude);
			var point = new BMap.Point(position.coords.longitude, position.coords.latitude);
			var geoc = new BMap.Geocoder();
			geoc.getLocation(point, function(rs){
				var addComp = rs.addressComponents;
				// alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
				var flag = addComp.province == addComp.city;
				$.getJSON('/static/js/lib/city.min.json', function(data){
					var citylist = data.citylist,
						html = "", k = 0;
					$.each(citylist, function(i, prov){
						//省市区
						if(prov.c[0].a){
							$.each(prov.c, function(j, city){
								searchData[k++] = city.n;
								html += '<li class="cityn '+(city.n == addComp.city ? "on" : "")+'" class="on" prov="'+i+'" city="'+j+'">'+city.n+'</li>';
							});
						}else{
							searchData[k++] = prov.p;
							html += '<li class="'+(prov.p == addComp.province ? "on" : "")+'" prov="'+i+'">'+prov.p+'</li>';
						}
					});
					searchData;
				});
			});
		}

	    function addListeners() {
			$("#consume-ul").on("click", ".good-div", function(){
				praise(this);
			});
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
			$("#searchInput").on("keyup", function(){
				hideMaskAndUl();
				var sVal = $(this).val();
				if(!sVal || sVal.trim() === ""){
					$("#searchUl").addClass("hidden").empty();
				}else{
					base.throttle(searchBusiness, this, 150);
				}
			});
			//选择城市按钮
			$("#city").on("click", function(){
				$("#mask, #consumeDiv").removeClass("hidden");
			});
			//城市选择列表
			$("#consumeUl").on("click", "li.cityn", function(){
				var value = $(this).text();
				//config.city = value;
				$("#city").find("span").text(value);
				doCityChose();
			});
			//点击覆盖层时，隐藏下拉列表
			$("#mask").on("click", function(){
				hideMaskAndUl();
			});
			$("#searchCity").on("click", function(){

			});
	    }

		//重新选择区域或类型后重新加载
		function doCityChose(){
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
			$("#mask, #consumeDiv").addClass("hidden");
		}

		function searchBusiness(){
			var sConfig = {
					province: config.province,
					city: config.city,
					area: config.area,
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