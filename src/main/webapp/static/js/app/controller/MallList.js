define([
    'app/controller/base',
    'app/util/ajax',
    'Handlebars'
], function (base, Ajax, Handlebars) {
    $(function () {
        var idx = base.getUrlParam("i");
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
        function getProduces(category) {
            Ajax.get(url, config, true)
                .then(function(res){
                    if(res.success){

                    }else{
                        doError();
                    }
                });
        }
        var length = $("#ml-head-ul>li").length;
        if(idx <= (length - 1)){
        	$("#ml-head-ul>li:eq("+idx+")").click();
        }else{
        	$("#ml-head-ul>li:first").click();
        }

        function doError() {
            $("#mlTable").replaceWith('<div id="cont" class="bg_fff" style="text-align: center;line-height: 150px;">暂无商品</div>');
        }
        function doSuccess() {
        }
    });
});
