define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'Handlebars'
], function (base, Ajax, dialog, Handlebars) {
    $(function () {
    	var url = APIURL + '/operators/queryCart', infos = [],
        	$this;
    	
    	if(sessionStorage.getItem("user") == "1"){
    		initView();
    	}

	    function initView() {
	        getMyCart();
	        addListeners();
	    }
	    function getMyCart() {
	        infos = [];
	        Ajax.get(url, true)
	            .then(function (response) {
	                if(response.success){
	                    var data = response.data, html = "";
	                    if(data.length){
	                        var totalAmount = 0;
							html = '<ul class="b_bd_b bg_fff">';
	                        data.forEach(function (cl) {
	                            var amount = (+cl.salePrice) * (+cl.quantity);
	                            cl.totalAmount = (amount / 1000).toFixed(0);

								html += '<li class="ptb8 plr10 clearfix b_bd_b p_r" code="'+cl.code+'" saleP="'+cl.salePrice+'">' +
										'<div class="wp100 p_r z_index0">' +
											'<div class="clearfix bg_fff cart-content-left">';
								if(cl.status == "0"){
									html += '<div class="cart-down t_999">已下架</div>';
								}
								html +=	'<div class="fl wp40 tc pl32 p_r c-img-l">'+
									'<div class="cart-cont-left"><div class="radio-tip1 ab_l0"><i></i></div></div>' +
									'<a href="../operator/buy.html?code='+cl.modelCode+'">' +
									'<img src="'+cl.pic1+'"/>' +
									'</a>' +
									'</div>' +
									'<div class="fl wp60 pl12">' +
									'<p class="t_323232 s_12 line-tow">'+cl.modelName+'</p>' +
									'<p class="t_f64444 s_12"><span>'+cl.totalAmount+'</span><span class="t_40pe s_10">积分</span></p>' +
									'<div class="t_666 ptb10">' +
									'<span class="subCount a_s_span t_bold tc"><img src="/static/images/sub-icon.png" style="width: 20px;"/></span>' +
									'<input class="buyCount tc w60p s_13 lh36" type="text" value="'+cl.quantity+'"/>' +
									'<span class="addCount a_s_span t_bold tc"><img src="/static/images/add-icon.png" style="width: 20px;"/></span>' +
									'</div>' +
									'</div>' +
									'</div>' +
									'<div class="al_addr_del">删除</div>' +
									'</div></li>';

	                            infos.push(amount);
	                        });
							html += "</ul>";

	                        $("#od-ul").html( html );
	                        $("#totalAmount").html("0");
	                    }else{
	                    	$("#cart-bottom").hide();
	                    	$("#cont").replaceWith('<div class="bg_fff" style="text-align: center;line-height: 150px;">购物车内暂无商品</div>');
	                    }
	                }else{
	                	$("#cart-bottom").hide();
						doError("#cont");
	                }
	            });
	    }
	    function addListeners() {
	        $("#sbtn").on("click", function () {
	            var checkItem = [];
	            var allItems = $("#od-ul>ul>li div.c-img-l div.radio-tip1");
				for(var i = 0; i < allItems.length; i++){
					var item = allItems[i];
					if( $(item).hasClass("active") ){
						if( !$(item).closest("li[code]").find("div.cart-down").length ){
							checkItem.push(i);
						}else{
							showMsg("您所选择的商品中包含已经下架的商品，<br/>请重新选择！", 3000);
							return;
						}
					}
				}
	            if(checkItem.length) {
	                location.href = '../operator/submit_order.html?code='+checkItem.join("_")+'&type=2';
	            }else{
	                showMsg("未选择购买的商品");
	            }
	        });
	        $("#od-ul").on("click", ".subCount", function (e) {
	            e.stopPropagation();
	            var $input = $(this).next();
	            var orig = $input.val();
	            if(orig == undefined || orig == "" || orig == "0" || orig == "1"){
	                orig = 2;
	            }
	            orig = +orig - 1;
	            $input.val(orig);
	            $input.change();
	        });
	        $("#od-ul").on("click", ".addCount", function (e) {
	            e.stopPropagation();
	            var $input = $(this).prev();
	            var orig = $input.val();
	            if(orig == undefined || orig == ""){
	                orig = 0;
	            }
	            orig = +orig + 1;
	            $input.val(orig);
	            $input.change();
	        });
	        $("#od-ul").on("keyup", "input", function (e) {
	            e.stopPropagation();
	            var keyCode = e.charCode || e.keyCode;
				var me = $(this);
				if(!isSpecialCode(keyCode) && !isNumber(keyCode)){
					me.val(me.val().replace(/[^\d]/g, ""));
	            }
				if(!me.val()){
					me.change();
				}
	        });
	        $("#od-ul").on("change", "input[type=text]", function (e) {
	            e.stopPropagation();
	            var keyCode = e.charCode || e.keyCode;
				var me = $(this);
	            if(!isSpecialCode(keyCode)){
					me.val(me.val().replace(/[^\d]/g, ""));
	            }
				if(!me.val()){
					me.val("1");
				}
				if(me.val() == "0"){
					me.val("1");
				}
	            var gp = $(this).parents("li[code]"), salePrice = +gp.attr("saleP");
	            var config = {
	                "code": gp.attr("code"),
	                "quantity": this.value
	            };
	            $("#loaddingIcon").removeClass("hidden");
				me = this;
	            Ajax.post(APIURL + '/operators/editCart', config)
	                .then(function(response){
	                	$("#loaddingIcon").addClass("hidden");
	                    if(response.success){
	                        var flag = gp.find(".c-img-l .radio-tip1.active").length,
	                        	$parent = $(me).parent(),
	                        	count = me.value,
	                            unit = salePrice,
	                            new_amount = unit * (+count),
	                            ori_amount = infos[gp.index()],
	                            ori_total = +$("#totalAmount").text() * 1000,
	                            new_total = new_amount - ori_amount + ori_total;
	                        infos[gp.index()] = new_amount;
	                        $parent.prev().find("span:first").text( ((+new_amount)/1000).toFixed(0) );
	                        if(flag){
	                            $("#totalAmount").text((new_total/1000).toFixed(0) );
	                        }
	                    }else{
	                    	var $parent = $(me).parent();
	                    	me.value = (+$parent.prev().find("span:first").text() * 1000) / salePrice;
	                        showMsg("数量修改失败，请重试！");
	                    }
	                });
	        });
	        $("#allChecked").on("click", function () {
	            var flag = false, me = $(this), doAction = "removeClass";
	            if(me.hasClass("active")){
	            	me.removeClass("active");
	            }else{
	            	me.addClass("active");
	            	flag = true;
	            	doAction = "addClass";
	            }
	            $("#od-ul>ul>li div.c-img-l div.radio-tip1")
	            	.each(function(i, item){
	            		$(item)[doAction]("active");
	            	});
	            if(flag){
	                var t = 0;
	                for(var i = 0; i< infos.length; i++){
	                    t += infos[i];
	                }
	                $("#totalAmount").text((t/1000).toFixed(0));
	                $("#deleteCheck").addClass("color_333");
	            }else{
	                $("#totalAmount").text("0");
	                $("#deleteCheck").removeClass("color_333");
	            }
	        });
	        $("#od-ul").on("click", "li[code] .cart-cont-left", function(e){
	            e.stopPropagation();
	            var $li = $(this).closest("li[code]"),
	            	isChecked = false, me = $(this).find(".radio-tip1");
	            if(me.hasClass("active")){
	            	me.removeClass("active");
	            }else{
	            	me.addClass("active");
	            	isChecked = true;
	            }
	            
	            if(isChecked){
	                if($("#od-ul>ul>li").length == $("#od-ul>ul>li .c-img-l div.active").length){
	                	$("#allChecked").addClass("active");
	                }
	                var ori_total = (+$("#totalAmount").text()) * 1000;
	                $("#totalAmount").text( ((ori_total + infos[$li.index()])/1000).toFixed(0) );
	            }else{
	                var items = $("#od-ul").children("li").find("input[type=checkbox]"),
	                    flag = false;
	                $("#allChecked").removeClass("active");
	                var ori_total = (+$("#totalAmount").text()) * 1000;
	                $("#totalAmount").text( ((ori_total - infos[$li.index()])/1000).toFixed(0) );
	            }
	        });
	        $("#odOk").on("click", function(){
				deleteFromCart($this);
	        	$("#od-mask, #od-tipbox").addClass("hidden");
	        });
	        $("#odCel").on("click", function(){
	        	$("#od-mask, #od-tipbox").addClass("hidden");
	        });
	        
	        $("#od-ul").on("touchstart", ".cart-content-left", function(e){
	        	e.stopPropagation();
	        	var touches = e.originalEvent.targetTouches[0],
	        		me = $(this);
	        	var left = me.offset().left;
	        	me.data("x",touches.clientX);
	        	me.data("offsetLeft", left);
	        });
	        $("#od-ul").on("touchmove", ".cart-content-left", function(e){
	        	e.stopPropagation();
	        	var touches =  e.originalEvent.changedTouches[0],
	        		me = $(this),
		            ex = touches.clientX,
		            xx = parseInt(me.data("x")) - ex,
	        	    left = me.data("offsetLeft");
		        if( xx > 10 ){
		        	me.css({
		        		"transition": "none",
		        		"transform": "translate3d("+(-xx/2)+"px, 0px, 0px)"
		        	});
		        }else if(xx < -10){
		        	var left = me.data("offsetLeft");
		        	me.css({
		        		"transition": "none",
		        		"transform": "translate3d("+(left + (-xx/2))+"px, 0px, 0px)"
		        	});
		        }
	        });
	        $("#od-ul").on("touchend", ".cart-content-left", function(e){
	        	e.stopPropagation();
	        	var me = $(this);
	            var touches = e.originalEvent.changedTouches[0],
	                ex = touches.clientX,
	                xx = parseInt(me.data("x")) - ex;
	        	if( xx > 56 ){
	        		me.css({
		        		"transition": "-webkit-transform 0.2s ease-in",
		        		"transform": "translate3d(-56px, 0px, 0px)"
		        	});
	            }else{
	            	me.css({
		        		"transition": "-webkit-transform 0.2s ease-in",
		        		"transform": "translate3d(0px, 0px, 0px)"
		        	});
	            }
	        });
	        
	        $("#od-ul").on("click", ".al_addr_del", function(e){
	        	e.stopPropagation();
	            $this = this;
	            $("#od-mask, #od-tipbox").removeClass("hidden");
	        });
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
    	function doError(cc) {
            $(cc).replaceWith('<div class="bg_fff" style="text-align: center;line-height: 150px;">暂时无法获取数据</div>');
        }
	    function isNumber(code){
	        if(code >= 48 && code <= 57 || code >= 96 && code <= 105){
	            return true;
	        }
	        return false;
	    }

	    function deleteFromCart(me) {
	        var $li = $(me).closest("li[code]"),
	            code = $li.attr('code');
	        $("#loaddingIcon").removeClass("hidden");
	        Ajax.post(APIURL + "/operators/deleteFromCart",
	            {"code": code})
	            .then(function (response) {
	            	$("#loaddingIcon").addClass("hidden");
	                if(response.success){
	                	var ccl = $(me).prev().find(".cart-cont-left"),
	                		activeRadio = ccl.find(".radio-tip1.active");
	                	if(activeRadio.length){
	                		activeRadio.click();
	                	}
	                    infos.splice($li.index(), 1);
	                    $li.remove();
	                    if(!$("#od-ul>ul>li").length){
	                    	$("#cart-bottom").hide();
	                    	$("#od-ul").html('<div class="bg_fff" style="text-align: center;line-height: 150px;">购物车内暂无商品</div>');
	                    }
	                }else{
	                    showMsg("删除失败，请重试！");
	                }
	            });
	    }

	    function isSpecialCode(code) {
	        if(code == 37 || code == 39 || code == 8 || code == 46){
	            return true;
	        }
	        return false;
	    }
    });
});