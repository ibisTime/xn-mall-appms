define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'lib/handlebars.runtime-v3.0.3'
], function (base, Ajax, dialog, Handlebars) {
    var code = base.getUrlParam("c") || "",
        name = base.getUrlParam("n");
    
    initView();

    function initView(){
        if(code){
            $("#name").text(name);
            addListeners();
        }else{
            showMsg("未传入商家编号!");
        }
    }

    function showMsg(msg){
        var d = dialog({
            content: msg,
            quickClose: true
        });
        d.show();
        setTimeout(function () {
            d.close().remove();
        }, 2000);
    }
    function addListeners() {
        $("#amount").on("keyup", function (e) {
            var keyCode = e.charCode || e.keyCode;
            var me = $(this);
            if(!isSpecialCode(keyCode) && !isNumber(keyCode)){
                me.val(me.val().replace(/[^\d]/g, ""));
            }
        });
        $("#sbtn").on("click", function(){
            var aVal = $("#amount").val();
            if(!aVal){
                showMsg("消费积分不能为空!");
            }else if(!/^\d+$/gi.test(aVal)){
                showMsg("消费积分必须为整数!");
            }else if(+aVal <= 0){
                showMsg("消费积分必须大于0!");
            }else{
                $("#integral").text(aVal);                
                $("#od-mask, #od-tipbox").removeClass("hidden");
            }
        });
        $("#odOk").on("click", function(){
            integralConsume();
        });
        $("#odCel").on("click", function(){
            $("#od-mask, #od-tipbox").addClass("hidden");
        });
    }

    function integralConsume(){
        $("#loaddingIcon").removeClass("hidden");
        Ajax.post(APIURL + "/user/integral/consume", {
            toMerchant: code,
            amount: +$("#amount").val() * 1000
        }).then(function (response) {
                $("#loaddingIcon").addClass("hidden");
                $("#od-mask, #od-tipbox").addClass("hidden");
                if (response.success) {
                    location.href = "./consume_success.html?m=" + response.data;
                }else{
                    showMsg(response.msg);
                }
            });
    }

    function isNumber(code){
        if(code >= 48 && code <= 57 || code >= 96 && code <= 105){
            return true;
        }
        return false;
    }

    function isSpecialCode(code) {
        if(code == 37 || code == 39 || code == 8 || code == 46){
            return true;
        }
        return false;
    }
});