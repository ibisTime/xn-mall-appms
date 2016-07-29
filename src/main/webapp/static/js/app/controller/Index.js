define([
    'app/controller/base',
    'app/util/ajax',
    'Handlebars',
    'app/util/dict',
    'lib/swiper-3.3.1.jquery.min'
], function (base, Ajax, Handlebars, dict) {
    $(function () {
        var indexTopImg = dict.get("indexTopImg");
        (function(){
            var html = '';
            indexTopImg.forEach(function(d){
                html += '<div class="swiper-slide"><img class="wp100" src="'+d+'"></div>';
            });
            $("#top-swiper").html(html);
            var mySwiper = new Swiper ('.swiper-container', {
                'direction': 'horizontal',
                'loop': true,
                'autoplay': 2000,
                'autoplayDisableOnInteraction': false,
                // 如果需要分页器
                'pagination': '.swiper-pagination'
            });
        })();
        var template = __inline("../ui/index-imgs.handlebars");
        var idx = 0, dataObj = {}, dataSeq = [];
        init();
        function init(){
            $.when(
                Ajax.get(APIURL + '/general/dict/list', {parentKey: "pro_category", "orderColumn": "id", "orderDir": "asc"}),
                Ajax.get(APIURL + '/commodity/product/list', true)
            ).done(function(res1, res2){
                    if(res1[1] == "success" && res2[1] == "success"){
                        /***category遍历***/
                        var cateData = res1[0].data;
                        for(var i = 0; i < cateData.length; i++){
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
                        var prodData = res2[0].data;
                        for(var i = 0; i < prodData.length; i++){
                            var dd = prodData[i], type = dd.type, cateId = dd.category;
                            dataObj[cateId].arr.productIntype[type]
                            if(!dataObj[cateId].arr.productIntype[type] ){
                                dataObj[cateId].arr.productIntype[type] = [];
                                dataObj[cateId].arr.typeSequence.push([type, dd.typePic]);
                            }
                            dataObj[cateId].arr.productIntype[type].push(dd);
                        }
                        /**生成html**/
                        for(var j = 0, len = dataSeq.length; j < len; j++){
                            var mm = dataObj[ dataSeq[j] ];
                            if(mm.arr.typeSequence.length){
                                getDLHtml(mm);
                            }
                        }
                    }
            });
            getRMTJ();
        }

        function getDLHtml(obj){
            var top = getDL(obj.dvalue, obj.dkey);    //[html, id]
            var productIntype = obj.arr.productIntype,
                typeSequence = obj.arr.typeSequence;
            doSuccess(productIntype, typeSequence, top[1], obj.dkey, top[0]);
        }

        function getRMTJ(){
            Ajax.post(APIURL + '/commodity/queryPageModel', {
                "toSite": "2",
                "start": "1",
                "limit": "4"
            }, true)
                .then(function (res) {
                    if (res.success) {
                        var data = res.data.list, html = '<table class="index-rmtj">';
                        if (data.length) {
                            for(var i = 0, len = data.length; i < len; i+=2){
                                if(i+1 <= len - 1){
                                    html += '<tr><td><a href="../operator/buy.html?code='+data[i].model.code+'"><img src="'+data[i].model.pic1+'"/></a></td>'+
                                            '<td><a href="../operator/buy.html?code='+data[i+1].model.code+'"><img src="'+data[i+1].model.pic1+'"/></a></td></tr>';
                                }else{
                                    html+= '<tr><td><a href="../operator/buy.html?code='+data[i].model.code+'"><img src="'+data[i].model.pic1+'"/></a></td>'+
                                            '<td></td></tr>';
                                }
                            }
                            html += '</table>';
                            $("#rmtj").html(html);
                        }
                    }
                });
        }
        function getDL(name, cate){
            var myId = "dlid" + idx;
            return ['<div class="plr10 s_12 ptb10 b_bd_b">' +
                '<img src="/static/images/fljx1.png" class="hp18p va-m"/>' +
                '<span class="pl10 va-m">'+name+'</span>' +
                '<a class="fr" href="../detail/mall_list.html?c='+cate+'"><span class="s_10 t_60pe">更多></span></a>' +
                '</div>' +
                '<div id="'+myId+'" class="icon-loading2"></div>', myId];
        }

        function doSuccess(productIntype, typeSequence, eId, category, tmp) {
            var html = '';
            for(var i = 0; i < typeSequence.length; i++){
                var arr = productIntype[ typeSequence[i][0] ], typePic = typeSequence[i][1];
                html += '<table class="wp100 index-table"><tr><td rowspan="2">' +
                    '<a href="../detail/mall_detail.html?t='+typeSequence[i][0]+'&c='+category+'"><img class="b_radius6" src="'+typePic+'"/></a></td>';
                for(var j = 0, len = arr.length; j < len; j+=2){
                    if(j + 1 <= len - 1){
                        if(j != 0){
                            html += '<tr>';
                            if(j > 2){
                                html += '<td></td>';
                            }
                        }
                        html += '<td class="pl6">' +
                            '<a class="clearfix" href="../detail/mall_detail.html?t='+typeSequence[i][0]+'&c='+category+'&pc='+arr[j].code+'">' +
                            '<div class="wp55 it-f">' +
                            '<div class="s_10">'+arr[j].name+'</div>' +
                            '<div class="s_08 nowrap t_40pe">'+arr[j].advTitle+'</div>' +
                            '</div>' +
                            '<div class="wp45 it-f"><img src="'+arr[j].advPic+'"></div></a>' +
                            '</td>' +
                            '<td class="pl6">' +
                            '<a class="clearfix" href="../detail/mall_detail.html?t='+typeSequence[i][0]+'&c='+category+'&pc='+arr[j+1].code+'">' +
                            '<div class="wp55 it-f">' +
                            '<div class="s_10">'+arr[j+1].name+'</div>' +
                            '<div class="s_08 nowrap t_40pe">'+arr[j+1].advTitle+'</div>' +
                            '</div>' +
                            '<div class="wp45 it-f"><img src="'+arr[j+1].advPic+'"></div></a>' +
                            '</td></tr>';
                    }else{
                        if(j != 0){
                            html += "<tr>";
                            if(j > 2){
                                html += '<td></td>';
                            }
                        }
                        html += '<td class="pl6">' +
                            '<a class="clearfix" href="../detail/mall_detail.html?t='+typeSequence[i][0]+'&c='+category+'&pc='+arr[j].code+'">' +
                            '<div class="wp55 it-f">' +
                            '<div class="s_10">'+arr[j].name+'</div>' +
                            '<div class="s_08 nowrap t_40pe">'+arr[j].advTitle+'</div>' +
                            '</div>' +
                            '<div class="wp45 it-f"><img src="'+arr[j].advPic+'"></div></a>' +
                            '</td><td class="pl6"></td></tr>';
                    }
                }
                html += '</tr></table>';
            }
            $("#allItems").append(tmp);
            $("#" + eId).replaceWith(html);
        }
    });
});
