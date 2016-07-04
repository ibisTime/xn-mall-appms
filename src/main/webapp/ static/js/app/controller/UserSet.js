define([
    'app/controller/base'
], function (base, Ajax) {
    $(function () {
    	var t = base.getUrlParam("t") || "0";
    	if(t == "1"){
			$("#tradePwd").attr("href", "./set_tradePwd.html");
		}else{
			$("#tradePwd").attr("href", "./find_tradePwd.html").html('设置交易密码<i class="r-tip"></i>');
		}

    });
});