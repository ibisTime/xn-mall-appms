define([
    'app/controller/base',
    'app/util/ajax',
    'Handlebars'
], function (base, Ajax, Handlebars) {
    $(function () {
        var template = __inline("../ui/mall-list.handlebars"),
        	idx = base.getUrlParam("i"),
            items = {}, count = 2, modelList = {}, first = true, finalData = [];
        $("#ml-head-ul").on("click", "li", function () {
            var $me = $(this);
            if(!$me.hasClass("active")){
                $("#ml-head-ul").find("li.active").removeClass("active");
                $me.addClass("active");
                getProduces($me.attr("l_type"));
            }
        });
        $("#updown").on("click", function(){
            var me = $(this);
            if(me.hasClass("down")){
                me.attr("src", "/static/images/u-arrow.png")
                    .removeClass("down").addClass("up");
                $("#ml-head-ul").css("height", "auto");
            }else if(me.hasClass("up")){
                me.attr("src", "/static/images/d-arrow.png")
                    .removeClass("up").addClass("down");
                $("#ml-head-ul").css("height", "48px");
            }

        });
        /*$("#searchIcon").on("click", function(){
            var sValue = $("#searchInput").val();
            if(sValue){
                $("#ml-head-ul").find("li.active").removeClass("active");
                getProduces1(sValue);
            }
        });*/
        function getProduces(type) {
            if(!first){
                $("#cont").replaceWith('<i id="cont" class="icon-loading1"></i>');
            }
            items = {}; count = 2;
            Ajax.get(APIURL + '/commodity/queryProduces', {
                "type": type
            }, true)
                .then(function (res) {
                    if (res.success) {
                        var data = res.data;
                        if (data.length) {
                            for (var i = 0; i < data.length; i++) {
                                var d = data[i];
                                items[d.code] = {
                                    "name": d.name,
                                    "advTitle": d.advTitle,
                                    "advPic": d.advPic,
                                    "code": d.code
                                };
                            }
                            isReady(doSuccess);
                        } else {
                            doError();
                        }
                    } else {
                        doError();
                    }
                });
            if(first){
                Ajax.get(APIURL + '/commodity/queryListModel', true)
                    .then(function (res) {
                        if (res.success) {
                            var data = res.data;
                            if (data.length) {
                                for (var i = 0; i < data.length; i++) {
                                    var d = data[i];
                                    if (d.buyGuideList.length) {
                                        if (modelList[d.productCode] == undefined) {
                                            modelList[d.productCode] = Infinity;
                                        }
                                        var s = +d.buyGuideList[0].discountPrice / 1000;
                                        if (s < modelList[d.productCode]) {
                                            modelList[d.productCode] = s;
                                        }
                                    }
                                }
                                isReady(doSuccess);
                            }else{
                                doError();
                            }
                        }else{
                            doError();
                        }
                    });
            }
        }
        var length = $("#ml-head-ul>li").length;
        if(idx <= (length - 1)){
        	$("#ml-head-ul>li:eq("+idx+")").click();
        }else{
        	$("#ml-head-ul>li:first").click();
        }
        
        function isReady(func) {
            if(!--count){
                func();
            }
        }
        function doError() {
            count = 0;
            $("#cont").replaceWith('<div id="cont" class="bg_fff" style="text-align: center;line-height: 150px;">暂无商品</div>');
        }
        function doSuccess() {
            first = false;
            finalData = [];
            for( var name in items ){
                if(modelList[name]){
                    items[name].price = modelList[name].toFixed(0);
                    finalData.push(items[name]);
                }
            }
            if(finalData.length){
            	var content = template({items: finalData});
                $("#cont").replaceWith(content);
            }else{
            	doError();
            }
        }
        function getProduces1(name) {
            $("#cont").replaceWith('<i id="cont" class="icon-loading1"></i>');
            items = {};
            Ajax.get(APIURL + '/commodity/queryProduces', {
                "name": name
            }, true)
                .then(function (res) {
                    if (res.success) {
                        var data = res.data;
                        if (data.length) {
                            for (var i = 0; i < data.length; i++) {
                                var d = data[i];
                                items[d.code] = {
                                    "name": d.name,
                                    "advTitle": d.advTitle,
                                    "advPic": d.advPic,
                                    "code": d.code
                                };
                            }
                            doSuccess();
                        } else {
                            doError();
                        }
                    } else {
                        doError();
                    }
                });
        }
    });
});
