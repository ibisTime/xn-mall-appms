define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loadImg/loadImg'
], function(base, Ajax, loadImg) {
    $(function() {
        var url = APIURL + "",
            sVal = base.getUrlParam("s") || "",
            first = true,
            isEnd = false,
            canScrolling = false,
            searchConfig = {
                limit: 15,
                start: 1,
                status: "3",
		        orderColumn: "order_no",
		        orderDir: "asc"
            },
            searchUrl = '808025';

        initView();

        function initView() {
            addListeners();
            if (sVal) {
                $("#searchInput").val(sVal);
                $("#searchIcon").click();
            }
        }

        function addListeners() {
            //搜索按钮
            $("#searchIcon").on("click", function() {
                sVal = $("#searchInput").val();
                first = true;
                isEnd = false;
                searchConfig.start = 1;
                canScrolling = false;
                $("#searchUl").empty();
                doSearch();
            });
            //页面下拉加载数据
            $(window).on("scroll", function() {
                var me = $(this);
                if (canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())) {
                    canScrolling = false;
                    doSearch();
                }
            });
        }

        function doSearch() {
            addLoading();
            searchConfig.name = sVal;
            Ajax.get(searchUrl, searchConfig, true)
                .then(function(res) {
                    if (res.success) {
                        var data = res.data,
                            list = data.list;
                        if (+data.totalCount <= searchConfig.limit || list.length < searchConfig.limit) {
                            isEnd = true;
                        }
                        if (list.length) {
                            var html = "";
                            list.forEach(function(d) {
                                html += '<li class="ptb8 clearfix b_bd_b">' +
                                    '<a class="show p_r min-h100p" href="../operator/buy.html?code=' + d.code + '">' +
                                    '<div class="order-img-wrap tc default-bg"><img class="center-img1 center-lazy" src="' + base.getImg(d.advPic) + '"/></div>' +
                                    '<div class="order-right-wrap clearfix">' +
                                    '<p class="t_323232 s_12 line-tow">' + d.name + '</p>' +
                                    '<p class="t_999 s_10 line-tow">' + d.slogan + '</p>'+
                                    '<p class="t_red ptb4">';
                                if(d.price2){
                                    html += '<span class="s_12 t_red">'+ base.formatMoney(d.price2) +'菜狗币</span>';
                                }
                                if (d.price2 && d.price3) {
                                    html += '<span class="s_12 t_red">+' + base.formatMoney(d.price3) +'抵金券</span>';
                                }else if(d.price3  && d.price2=='0'){
                                	html += '<span class="s_12 t_red">'+ base.formatMoney(d.price3) +'抵金券</span>';
                                }
                                html += '</p>';
                                if (d.originalPrice) {
                                    html += '<p class="s_10">市场参考价：<span>' + base.formatMoney(d.originalPrice) + '</span>元</p>';
                                }
                                html += '</div></a></li>';
                            });
                            removeLoading();
                            $("#searchUl").append(loadImg.loadImg(html));
                            searchConfig.start += 1;
                        } else {
                            if (first) {
                                doError("没有相关商品");
                            } else {
                                removeLoading();
                            }
                            isEnd = true;
                        }
                    } else {
                        if (first) {
                            doError();
                        } else {
                            removeLoading();
                        }
                        isEnd = true;
                    }
                    first = false;
                    canScrolling = true;
                });
        }

        function addLoading() {
            $("#searchUl").append('<li class="scroll-loadding"></li>');
        }

        function doError(msg) {
            msg = msg || "暂时无法获取商品信息";
            $("#searchUl").html('<li class="bg_fff" style="text-align: center;line-height: 110px;">' + msg + '</li>');
        }

        function removeLoading() {
            $("#searchUl").find(".scroll-loadding").remove();
        }
    });
});
