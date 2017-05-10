define([
    'app/controller/base',
    'app/util/ajax', 
    'app/module/loading/loading',
    'app/module/judgeBindMobile/judgeBindMobile'
], function(base, Ajax, loading, JudgeBindMobile) {

    initView();

    function initView() {
        loading.createLoading();
        if (base.isLogin()) {
            $.when(
                getUserInfo(),
                getAccount(),
                getMobile()
            ).then(loading.hideLoading, loading.hideLoading);
            addListener();
        }
        
//      $("#demo").click(function(){
//      	JudgeBindMobile.addCont({
//              success: function(resMobile, resSms){
//              	mobile = resMobile;
//              	smsCaptcha = resSms;
//              	alert("smsCaptcha1"+smsCaptcha+",mobile1"+mobile);
//              	getAppID();
//              }
//          }).showCont();
//      })
        
    }
    // 获取手机号
    function getMobile(){
        return Ajax.get("807717", {
            "ckey": "telephone"
        }).then(function(res){
            loading.hideLoading();
            if(res.success){
                $("#telephone").html('<a href="tel://'+res.data.note+'">'+res.data.note+'</a>');
            }else{
                base.showMsg(res.msg);
            }
        });
    }
    // 获取账户信息
    function getAccount() {
        return Ajax.get("802503", {userId: base.getUserId()}).then(function(res) {
            if (res.success) {
                var data = res.data;
                data.forEach(function(d, i) {
                    if (d.currency == "CNY") {
                        $("#cnyAmount").html(base.formatMoneyD(d.amount));
                    } else if (d.currency == "CGJF") {
                        $("#jfAmount").html(base.formatMoneyD(d.amount));
                    } else if (d.currency == "CGB") {
                        $("#cgbAmount").html(base.formatMoneyD(d.amount));
                    }
                })
            }
        });
    }
    // 获取用户信息
    function getUserInfo(){
        return base.getUser()
            .then(function(response) {
                if (response.success) {
                    var data = response.data;
                    $("#mobile").text(data.mobile);
                    sessionStorage.setItem("m", data.mobile);
                } else {
                    base.showMsg(response.msg || "暂时无法获取用户信息！");
                }
            });
    }
    function addListener(){
        //我的摇钱树
        $("#ifTree").on("click", function() {
            loading.showLoading();
            Ajax.post('615118', {
                json: {
                    userId: base.getUserId()
                }
            }).then(function(response) {
                loading.hideLoading();
                if (response.success) {
                    var data = response.data;
                    //摇钱树要跳转的页面
                    if (!data || !data.length) {
                        location.href = "../new/moneyTree.html";
                    } else {
                        location.href = "../new/hadBuyed.html";
                    }
                } else {
                    base.showMsg(response.msg);
                }
            });

        });
    }
});
