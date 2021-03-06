define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {

    var rate = 1;
    var totalAmount = 0;

    initView();

    function initView() {
        addListeners();
        loading.createLoading();
        $.when(
            getAccount(),
            getCGB2CGJFRate()
        ).then(loading.hideLoading, loading.hideLoading);
    }
    // 获取菜狗币转抵金券汇率
    function getCGB2CGJFRate(){
        return getTransRate("CGB", "CGJF");
    }
    // 获取转化汇率
    function getTransRate(from, to){
        return Ajax.get("002051", {
            fromCurrency: from,
            toCurrency: to
        }).then(function(res){
            rate = res.data.rate;
        });
    }
    function getAccount(){
        return Ajax.get("802503", {
            userId: base.getUserId()
        }).then(function(res){
            if(res.success){
                var data = res.data;
                data.forEach(function(d, i){
                    if(d.currency == "CGB"){
                        $("#reaminCGB").html(base.formatMoney(d.amount) + " , 1菜狗币兑换" + (rate) + "抵金券" );
                    }
                })
            }
        });
    }
    function addListeners() {
        $("#jfAmount").on("keyup", function(){
            var self = $(this),
                value = self.val();
            if($.isNumeric(value)){
                totalAmount = value * 1000;
                $("#needAmount").val(base.formatMoney(totalAmount / rate));
            }else{
                totalAmount = 0;
                $("#needAmount").val(0);
            }
        });
        $("#sbtn").click(function(){
            pay();
        });
    }
    function pay(){
        loading.createLoading("支付中...");
        Ajax.post("802412", {
            json: {
                fromAmount: $("#needAmount").val()*1000,
                fromCurrency: "CGB",
                userId: base.getUserId(),
                toCurrency: "CGJF"
            }
        }).then(function(res){
            loading.hideLoading();
            if(res.success){
                base.showMsg("抵金券购买成功");
                setTimeout(function(){
            		base.getBack();
                }, 1000);
            }else{
                loading.hideLoading();
                base.showMsg(res.msg);
            }
        });
    }
});
