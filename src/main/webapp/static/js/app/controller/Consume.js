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
    	        orderColumn: "total_dz_num"
    	    }, first = true, isEnd = false, canScrolling = false,
			contentTmpl = __inline("../ui/consume.handlebars"),
			searchData = [], PROVINCE, CITY;

		if(sessionStorage.getItem("user") !== "1"){
            location.href = "../user/login.html?return=" + encodeURIComponent(location.pathname + location.search);
        }else{
            initView();
        }
		
	    function initView() {
			PROVINCE = sessionStorage.getItem("province");
			CITY = sessionStorage.getItem("city") || "";
			if(!PROVINCE){
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r){
					if(this.getStatus() == BMAP_STATUS_SUCCESS){
						showPosition(r.point.lng, r.point.lat);
					}
					else {
						alert('failed'+this.getStatus());
					}        
				},{enableHighAccuracy: true});
			}else{
				CITY = CITY || PROVINCE;
				getLocationJSON();
			}
	        addListeners();
	    }

		function showPosition(longitude, latitude){
			var point = new BMap.Point(longitude, latitude);
			var geoc = new BMap.Geocoder();
			geoc.getLocation(point, function(rs){
				var addComp = rs.addressComponents;
				PROVINCE = addComp.province;
				CITY = addComp.city;
				getLocationJSON();
			});
		}
		function getLocationJSON(){
			$("#loaddingIcon").addClass("hidden");
			$.getJSON('/static/js/lib/city.min.json', function(data){
					citylist = data.citylist;
					var	html = "", k = 0;
					$.each(citylist, function(i, prov){
						//省市区
						if(prov.c[0].a){
							$.each(prov.c, function(j, city){
								searchData.push(city.n);
								if(city.n == CITY  || CITY.indexOf(city.n) != -1 || city.n.indexOf(CITY) != -1){
									html += '<li class="cityn on" prov="'+i+'" city="'+j+'">'+city.n+'</li>';
									$("#nowDiv").html('<input type="button" class="btn" id="nowCity" prov="'+i+'" city="'+j+'" value="'+city.n+'"/>');
									config.province = prov.p;
									config.city = city.n;
									$("#city").find("span").text(city.n);
									sessionStorage.setItem("province", prov.p);
									sessionStorage.setItem("city", city.n);
									businessPage();
								}else{
									html += '<li class="cityn" prov="'+i+'" city="'+j+'">'+city.n+'</li>';
								}
							});
						}else{
							searchData.push(prov.p);
							if(prov.p == PROVINCE || PROVINCE.indexOf(prov.p) != -1 || prov.p.indexOf(PROVINCE) != -1){
								$("#nowDiv").html('<input type="button" class="btn" id="nowCity" prov="'+i+'" value="'+prov.p+'"/>');
								html += '<li class="cityn on" prov="'+i+'">'+prov.p+'</li>';
								config.province = prov.p;
								config.city = "";
								sessionStorage.setItem("province", prov.p);
								sessionStorage.setItem("city", "");
								$("#city").find("span").text(config.province);
								businessPage();
							}else{
								html += '<li class="cityn" prov="'+i+'">'+prov.p+'</li>';
							}
						}
					});
					$("#consumeUl").html(html);
				});
		}
	    function addListeners() {
			$("#consume-ul").on("click", ".good-div", function(e){
				e.preventDefault();
				e.stopPropagation();
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
				if($("#consumeDiv").hasClass("hidden")){
					$("#noResult").addClass("hidden");
					//$("#consumeUl").find("li.on").removeClass("on");
					$("#mask, #consumeDiv").removeClass("hidden");
				}else{
					$("#mask, #consumeDiv").addClass("hidden");
				}
				
			});
			//城市选择列表
			$("#consumeUl").on("click", "li.cityn", function(){
				var li = $(this), value = li.text(),
					prov = li.attr("prov"),
					city = li.attr("city");
				$("#consumeUl").find("li.on").removeClass("on");
				li.addClass("on");
				config.province = citylist[prov].p;
				config.city = city && citylist[prov].c[city].n || "";
				config.start = 1;
				sessionStorage.setItem("province", config.province);
				sessionStorage.setItem("city", config.city);
				$("#nowCity").val(value);
				$("#city").find("span").text(value);
				doCityChose();
			});
			//点击覆盖层时，隐藏下拉列表
			$("#mask").on("click", function(){
				hideMaskAndUl();
			});
			$("#searchCity").on("click", function(){
				var name = $("#cityInput").val().trim(), flag = false;
				if(!name){
					showMsg("搜索条件不能为空!");
					return;
				}
				$("#sResult").addClass("hidden")
				for(var i = 0; i < searchData.length; i++){
					if(searchData[i].indexOf(name) != -1){
						var li =  $("#consumeUl").find("li:eq("+i+")");
						var prov = li.attr("prov"), city = li.attr("city");
						$("#sResult").removeClass("hidden").html('<input class="btn" type="button" value="'+searchData[i]+'" indx="'+i+'"/>');
						flag = true;
						break;
					}
				}
				if(!flag){
					$("#sResult").addClass("hidden");
					$("#noResult").removeClass("hidden");
				}else{
					$("#noResult").addClass("hidden");
				}
			});
			$("#con-table").on("click", "a", function(){
				var type = $(this).attr("l_type"),
					li = $("#consumeUl").find("li.on"),
					url = "";
				url = "./list.html?t=" + type + "&p=" + li.attr("prov");
				var city = li.attr("city");
				if(city){
					url += "&c=" + li.attr("city") || "";
				}
				location.href = url;
			});
			$("#sResult").on("click", "input", function(){
				var idx = $(this).attr("indx"),
					$conUl = $("#consumeUl");
				var li =  $conUl.find("li:eq("+idx+")");
				li.click();
				$("#sResult").addClass("hidden");
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
					orderColumn: "total_dz_num"
				};
			Ajax.post(url, sConfig)
	            .then(function (response) {
	                if (response.success) {
						var html = "", curList = response.data.list;
						if(curList.length){
							curList.forEach(function(item){
								html += '<li><a class="show" href="./detail.html?c='+item.code+'">'+item.name+'</a></li>';
							});
							$("#searchUl").removeClass("hidden").html(html);
						}else{
							$("#searchUl").empty().addClass("hidden");
						}
					}
				});
		}
	    
	    function praise(me){
			var $me = $(me),
				code = $me.closest("li[code]").attr("code"),
				span = $me.find("span");
			$("#loaddingIcon1").removeClass("hidden");
	    	Ajax.post(APIURL + "/user/praise", {toMerchant: code})
	            .then(function (response) {
					$("#loaddingIcon1").addClass("hidden");
	                if (response.success) {
						span.text(+span.text() + 1);
					}else{
						showMsg(response.msg);
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