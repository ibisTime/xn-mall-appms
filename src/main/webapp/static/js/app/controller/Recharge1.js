define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dict',
    'app/util/dialog'
], function (base, Ajax, dict, dialog) {
    $(function () {
    	var accountNum = "";
        init();
        
        function init(){
        	Ajax.get(APIURL + "/account/get", {"currency": "CNY"}, true)
            .then(function (response) {
                if(response.success){
                    var data = response.data;
                    accountNum = data.accountNumber;
                }else{
                    showMsg("账户信息获取失败！");
                    $("#sbtn").attr("disabled", "disabled");
                }
            });
            addListeners();
        }
        
        function addListeners(){
            $("#account").on("change", validateAccount);
            $("#amount").on("change", validateAmount);
            $("#sbtn").on("click", function(){
                if(validateAccount() && validateAmount()){
                    doRecharge();
                }
            })
        }
        function validateAccount(){
            var me = $("#account")[0];
            if(!me.value || !me.value.trim()){
                showMsg("支付账号不能为空!");
                return false;
            }
            return true;
        }
        function validateAmount() {
	        var flag = true, me = $("#amount"), amount = me.val();
	        if(amount == undefined || amount === ""){
	            showMsg("充值金额不能为空！");
	            flag = false;
	        }else if( !/^\d+(?:\.\d{1,2})?$/.test(amount) ) {
	            showMsg("充值金额只能是两位以内小数！");
	            flag = false;
	        }else if(+amount <= 0){
	            showMsg("充值金额必须大于0！");
	            flag = false;
	        }
	        return flag;
	    }
        function doRecharge(){
            $("#sbtn").attr("disabled", "disabled").val("提交中...");
            var config = {
            		"accountNumber": accountNum,
            		"amount": $("#amount").val() * 1000,
            		"fromCode": $("#account").val()
            	};
            Ajax.post(APIURL + "/account/doRecharge", config)
	            .then(function (response) {
	                if(response.success){
	                	$("#sbtn").val("提交");
                        location.href = "./recharge2.html";
	                }else{
	                    showMsg(response.msg);
	                    $("#sbtn").removeAttr("disabled").val("提交");
	                }
	            });
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
        
    });
});
