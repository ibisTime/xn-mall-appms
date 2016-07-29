define([
    'app/controller/base',
    'app/util/ajax',
    'Handlebars'
], function (base, Ajax, Handlebars) {
    $(function () {
        var cate = base.getUrlParam("c") || "";
        init();
        function init(){
            var html = '';
            addListeners();
            Ajax.get(APIURL + '/general/dict/list',
                {parentKey: "pro_category", "orderColumn": "id", "orderDir": "asc"})
                .then(function(res){
                    if(res.success){
                        var cateData = res.data;
                        for(var i = 0; i < cateData.length; i++){
                            var d = cateData[i];
                            html += '<li class="fl pt8 pr20" l_type="'+d.dkey+'"><span class="inline_block pb10">'+d.dvalue+'</span></li>';
                        }
                        $("#ml-head-ul").html(html).css("height", "auto");
                        if( +$("#ml-head-ul").height() > 55 ){
                            $("#ml-head-ul").css("height", "48px");
                            $("#updown").removeClass("hidden");
                        }
                        if(cate){
                            $("#ml-head-ul").find("li[l_type="+cate+"]").click();
                        }else{
                            $("#ml-head-ul").children("li:first").click();
                        }
                    }
                });
        }
        function addListeners(){
            $("#ml-head-ul").on("click", "li", function () {
                var $me = $(this);
                if(!$me.hasClass("active")){
                    $("#ml-head-ul").find("li.active").removeClass("active");
                    $me.addClass("active");
                    getProduces($me.attr("l_type"));
                }
                var $ud = $("#updown");
                if(!$ud.hasClass("hidden") && $ud.hasClass("up")){
                    $("#updown").click();
                }
            });
            $("#updown").on("click", function(){
                var me = $(this);
                if(me.hasClass("down")){
                    me.attr("src", "/static/images/u-arrow.png")
                        .removeClass("down").addClass("up");
                    $("#ml-head-ul").css("height", "auto");
                    $("#mask").removeClass("hidden");
                }else if(me.hasClass("up")){
                    me.attr("src", "/static/images/d-arrow.png")
                        .removeClass("up").addClass("down");
                    $("#ml-head-ul").css("height", "48px");
                    $("#mask").addClass("hidden");
                }

            });
            $("#mask").on("click", function(){
                var $ud = $("#updown");
                if(!$ud.hasClass("hidden") && $ud.hasClass("up")){
                    $("#updown").click();
                }
            });
        }

        function getProduces(category) {
            var url = APIURL + "/commodity/subdivision/list";
            Ajax.get(url, {"category": category}, true)
                .then(function(res){
                    if(res.success){
                        var data = res.data;
                        if(data.length){
                            var html = '<table class="wp100 mall_list_table" id="mlTable">';
                            for(var i = 0, len = data.length; i < len; i+=3){
                                if(i + 2 <= len - 1){
                                    html += '<tr><td><a href="./mall_detail.html?pc='+ data[i].code+'"><img class="b_radius6" src="'+ data[i].typePic+'"/></a></td>'+
                                        '<td><a href="./mall_detail.html?pc='+ data[i+1].code+'"><img class="b_radius6" src="'+ data[i+1].typePic+'"/></a></td>'+
                                        '<td><a href="./mall_detail.html?pc='+ data[i+2].code+'"><img class="b_radius6" src="'+ data[i+2].typePic+'"/></a></td></tr>';
                                }else if(i + 1 <= len - 1){
                                    html += '<tr><td><a href="./mall_detail.html?pc='+ data[i].code+'"><img class="b_radius6" src="'+ data[i].typePic+'"/></a></td>'+
                                        '<td><a href="./mall_detail.html?pc='+ data[i+1].code+'"><img class="b_radius6" src="'+ data[i+1].typePic+'"/></a></td><td></td></tr>';
                                }else{
                                    html += '<tr><td><a href="./mall_detail.html?pc='+ data[i].code+'"><img class="b_radius6" src="'+ data[i].typePic+'"/></a></td>'+
                                    '<td></td><td></td></tr>';
                                }
                            }
                            html += '</table>';
                            $("#cont").hide();
                            $("#mlTable").replaceWith(html);
                        }else{
                            doError();
                        }
                    }else{
                        doError();
                    }
                });
        }

        function doError() {
            $("#cont").hide();
            $("#mlTable").replaceWith('<div id="mlTable" class="bg_fff" style="text-align: center;line-height: 150px;">暂无商品</div>');
        }
    });
});
