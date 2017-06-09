define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/validate/validate'
], function(base, Ajax, loading, Validate) {
	
    var returnUrl = sessionStorage.getItem("returnhref");
    var returnStatus = base.getUrlParam("return");
	
    init();
    function init(){
        if(!base.isLogin()){
            base.goLogin();
            return;
        }
        loading.createLoading();
        $("#userId").val(base.getUserId());
        addListeners();
        getBankCode();
    }
    function getBankCode(){
        Ajax.get("802116").then(function(res){
            loading.hideLoading();
            if(res.success){
                var html = "";
                for(var i = 0;i < res.data.length ; i++) {
                	html += '<option value="'+res.data[i].bankName+'" code="'+res.data[i].bankCode+'">'+res.data[i].bankName+'</option>';
                }
                
                $("#bankName").html(html);
            }else{
                base.showMsg(res.msg);
            }
        });
    }
    function addListeners(){
        $("#bankCardForm").validate({
            'rules': {
                realName: {
                    required: true,
                    isNotFace: true,
                    maxlength: 16
                },
                bankName: {
                    required: true
                },
                subbranch: {
                    required: true,
                    isNotFace: true,
                    maxlength: 255
                },
                bindMobile: {
                    required: true,
                    mobile: true
                },
                bankcardNumber: {
                    required: true,
                    bankCard: true
                }
            },
            onkeyup: false
        });
        $("#sbtn").on("click", function(){
            if($("#bankCardForm").valid()){
                addBankCard();
            }
        });
        $("#bankName").on("change", function(){
            $("#bankNameSpan").html($("#bankName").val())
            $("#bankCode").val($("#bankName option:selected").attr("code"));
        });
    }
    function addBankCard(){
        loading.createLoading("保存中...");
        var param = $("#bankCardForm").serializeObject();
        Ajax.post("802010", {json: param})
            .then(function(res){
                loading.hideLoading();
                if(res.success){
                    base.showMsg("添加银行卡成功");
                    setTimeout(function(){
                    	if(returnStatus){
                    		location.href = returnUrl;
                    	}else{
                    		base.getBack();
                    	}
                    }, 1000);
                }else{
                    base.showMsg(res.msg);
                }
            });
    }
})
