define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dict',
    'lib/swiper-3.3.1.jquery.min'
], function(base, Ajax, Handlebars, dict) {
    var loadImg = 'data:image/gif;base64,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';

    var idx = 0,
        dataObj = {},
        dataSeq = [];

    init();

    function init() {
        addListeners();
        $.when( //获取大类的数据字典
                Ajax.get(APIURL + '/general/dict/list', { parentKey: "pro_category", "orderColumn": "id", "orderDir": "asc" }),
                //获取产品信息
                Ajax.get(APIURL + '/commodity/product/list', true)
            )
            .then(function(res1, res2) {
                res1 = res1[0];
                res2 = res2[0];
                if (res1.success && res2.success) {
                    /***category遍历***/
                    var cateData = res1.data;
                    for (var i = 0; i < cateData.length; i++) {
                        var d = cateData[i];
                        dataObj[d.dkey] = {
                            "dvalue": d.dvalue,
                            "dkey": d.dkey,
                            "arr": {
                                "productIntype": {},
                                "typeSequence": []
                            }
                        };
                        dataSeq.push(d.dkey);
                    }
                    /**product遍历归类**/
                    var prodData = res2.data;
                    for (var i = 0; i < prodData.length; i++) {
                        var dd = prodData[i],
                            type = dd.type,
                            cateId = dd.category;
                        if (!dataObj[cateId].arr.productIntype[type]) {
                            dataObj[cateId].arr.productIntype[type] = [];
                            dataObj[cateId].arr.typeSequence.push([type, dd.typePic]);
                        }
                        dataObj[cateId].arr.productIntype[type].push(dd);
                    }
                    /**生成html**/
                    for (var j = 0, len = dataSeq.length; j < len; j++) {
                        var mm = dataObj[dataSeq[j]];
                        if (mm.arr.typeSequence.length) {
                            getDLHtml(mm);
                        }
                    }
                    $("img.lazy").lazyload({ effect: "fadeIn" });
                }
            });
    }

    function addListeners() {
        $("#searchIcon").on("click", function() {
            var sVal = $("#searchInput").val().trim();
            sVal = decodeURIComponent(sVal);
            location.href = "./search.html?s=" + sVal;
        });
    }

    //生成大类
    function getDLHtml(obj) {
        var top = getDL(obj.dvalue, obj.dkey); //[html, id]
        var productIntype = obj.arr.productIntype,
            typeSequence = obj.arr.typeSequence;
        doSuccess(productIntype, typeSequence, top[1], obj.dkey, top[0]);
    }

    //生成大类的html
    function getDL(name, cate) {
        var myId = "dlid" + idx;
        return ['<div class="plr10 s_12 ptb10 b_bd_b">' +
            '<img src="/static/images/fljx1.png" class="hp18p va-m"/>' +
            '<span class="pl10 va-m">' + name + '</span>' +
            '<a class="fr" href="../detail/mall_list.html?c=' + cate + '"><span class="s_10 t_60pe">更多></span></a>' +
            '</div>' +
            '<div id="' + myId + '" class="icon-loading2"></div>', myId
        ];
    }
    //每个大类下的html
    function doSuccess(productIntype, typeSequence, eId, category, tmp) {
        var html = '';
        for (var i = 0; i < typeSequence.length; i++) {
            var arr = productIntype[typeSequence[i][0]],
                typePic = typeSequence[i][1];
            html += '<table class="wp100 index-table"><tr><td rowspan="2">' +
                '<a class="pl10" href="../detail/mall_detail.html?t=' + typeSequence[i][0] + '&c=' + category + '"><img class="b_radius6 lazy" src="' + loadImg + '" data-original="' + typePic + '"/></a></td>';
            for (var j = 0, len = arr.length; j < len; j += 2) {
                if (j + 1 <= len - 1) {
                    if (j != 0) {
                        html += '<tr>';
                        if (j > 2) {
                            html += '<td></td>';
                        }
                    }
                    html += '<td class="pl6">' +
                        '<a class="clearfix show" href="../detail/mall_detail.html?t=' + typeSequence[i][0] + '&c=' + category + '&pc=' + arr[j].code + '">' +
                        '<div class="wp55 it-f">' +
                        '<div class="s_10">' + arr[j].name + '</div>' +
                        '<div class="s_08 t_40pe">' + arr[j].advTitle + '</div>' +
                        '</div>' +
                        '<div class="wp45 it-f"><img class="lazy" src="' + loadImg + '" data-original="' + arr[j].advPic + '"></div></a>' +
                        '</td>' +
                        '<td class="pl6">' +
                        '<a class="clearfix show" href="../detail/mall_detail.html?t=' + typeSequence[i][0] + '&c=' + category + '&pc=' + arr[j + 1].code + '">' +
                        '<div class="wp55 it-f">' +
                        '<div class="s_10">' + arr[j + 1].name + '</div>' +
                        '<div class="s_08 t_40pe">' + arr[j + 1].advTitle + '</div>' +
                        '</div>' +
                        '<div class="wp45 it-f"><img class="lazy" src="' + loadImg + '" data-original="' + arr[j + 1].advPic + '"></div></a>' +
                        '</td></tr>';
                } else {
                    if (j != 0) {
                        html += "<tr>";
                        if (j > 2) {
                            html += '<td></td>';
                        }
                    }
                    html += '<td class="pl6">' +
                        '<a class="clearfix show" href="../detail/mall_detail.html?t=' + typeSequence[i][0] + '&c=' + category + '&pc=' + arr[j].code + '">' +
                        '<div class="wp55 it-f">' +
                        '<div class="s_10">' + arr[j].name + '</div>' +
                        '<div class="s_08 t_40pe">' + arr[j].advTitle + '</div>' +
                        '</div>' +
                        '<div class="wp45 it-f"><img class="lazy" src="' + loadImg + '" data-original="' + arr[j].advPic + '"></div></a>' +
                        '</td><td class="pl6"></td></tr>';
                }
            }
            html += '</tr></table>';
        }
        $("#allItems").append(tmp);
        $("#" + eId).replaceWith(html);
    }
});