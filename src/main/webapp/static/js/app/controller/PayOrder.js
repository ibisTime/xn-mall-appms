define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dict',
    'app/util/dialog',
    'Handlebars'
], function (base, Ajax, Dict, dialog, Handlebars) {
	var code = base.getUrlParam("code") || "",
        receiptType = Dict.get("receiptType"),
        contentTmpl = __inline("../ui/pay-order-imgs.handlebars")/*,
        addressTmpl = __inline("../ui/pay-order-address.handlebars")*/;

	queryOrder();
	addListener();

	function queryOrder() {
        var url = APIURL + '/operators/queryOrder',
            config = {
                "invoiceCode": code
            };
        var modelCode = "" ,modelName, quantity, salePrice, receiveCode, productName;
        Ajax.post(url, config)
            .then(function(response){
                if(response.success){
                    var data = response.data,
                        invoiceModelLists = data.invoiceModelList;
                    if(data.status !== "1"){
                        location.href = "../user/user_info.html";
                    }
                    $("#cont").remove();
                    $("#od-rtype").html(getReceiptType(data.receiptType));
                    $("#od-rtitle").html(data.receiptTitle || "无");
                    //收货信息编号
                    if(invoiceModelLists.length){
                        invoiceModelLists.forEach(function (invoiceModelList) {
                            quantity = invoiceModelList.quantity;
                            salePrice = invoiceModelList.salePrice;
                            invoiceModelList.totalAmount = ((+salePrice)*(+quantity) / 1000).toFixed(0);
                        });
                        $("#cont").remove();
                        $("footer, #items-cont").removeClass("hidden");
                        $("#items-cont").append( contentTmpl({items: invoiceModelLists}) );
                        $("#po-total").html((+data.totalAmount/1000).toFixed(0));

                        var addData = data.address || {};
                        addData.totalAmount = (+data.totalAmount/1000).toFixed(0);
                        addData.orderCode = code;
                        var addrHtml = '<p><span class="pr1em">总积分</span>：<span class="pl_5rem">'+ addData.totalAmount+'<span></span></p>' +
                            '<p><span class="pr1em">订单号</span>：<span class="pl_5rem">'+ addData.orderCode+'</span></p>';
                        if(addData.addressee){
                            addrHtml += '<p><span>配送信息：</span><span class="pl_5rem">'+addData.addressee+'</span><span class="pl10">'+addData.mobile+'</span></p>' +
                            '<p class="pl5_5rem t_73 s_09_5"><span class="pr10">'+addData.province+'</span>' +
                            '<span class="pr10">'+addData.city+'</span><span class="pr10">'+addData.district+'</span><span>'+addData.detailAddress+'</span></p>';
                        }
                        $("#addressDiv").html(addrHtml);
                    }else{
                    	$("#cont").remove();
                    	doError("#container");
                    }
                }else{
                	$("#cont").remove();
                	doError("#container");
                }
            });
    }

    function doError(cc) {
        $(cc).html('<div class="bg_fff" style="text-align: center;line-height: 150px;">暂时无法获取数据</div>');
    }

    function showMsg(cont){
        var d = dialog({
                    content: cont,
                    quickClose: true
                });
        d.show();
        setTimeout(function () {
            d.close().remove();
        }, 2000);
    }

    function getReceiptType(data) {
        return data == "" ? "无": receiptType[data];
    }

    function addListener() {
        $("#sbtn").on("click", function (e) {
            e.stopPropagation();
            $("#loaddingIcon").removeClass("hidden");
            Ajax.post(APIURL + '/operators/payOrder',
                {
                    code: code,
                    amount: +$("#po-total").text() * 1000
                }
            ).then(function (response) {
                    if(response.success){
                        location.href = "./pay_success.html";
                    }else{
                        $("#loaddingIcon").addClass("hidden");
                        showMsg(response.msg);
                        setTimeout(function(){
                            location.href = "../user/user_info.html";
                        }, 2000);
                    }
                });
        });
    }
});