define([
    'app/controller/base', 'app/util/ajax'
], function(base, Ajax) {
    if(!base.isLogin()){
        base.goLogin();
        return;
    }
    $("#loginOut").on("click", function() {
        $("#loaddingIcon").removeClass("hidden");
        sessionStorage.setItem("user", "0");
        location.href = '../index.html';
    });
});
