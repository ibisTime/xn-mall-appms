define([
	'app/controller/base',
    'app/util/ajax',
    'app/util/dialog',
    'Handlebars'
], function (base, Ajax, dialog, Handlebars) {
	$(function(){
		var count = 1, returnUrl = base.getUrlParam("return"),
			userReferee = base.getUrlParam("u"), toUser;
		addListeners();
		init();
        function init(){
        	$("#captchaImg").click();
            var url = "./login.html";
            if(returnUrl){
                url = url + "?return=" + encodeURIComponent(returnUrl);
            }
            $("#toLogin").attr("href", url);
            getTjr();
        }
		function addListeners() {
            $("#mobile").on("change", validate_mobile);
            $("#captcha").on("change", validate_captcha);
            $("#registerBtn").on("click", function (e) {
                register();
            });
            $("#captchaImg").on("click", function () {
                $(this).attr( 'src', APIURL + '/captcha?_=' + new Date().getTime() );
            });
        }
        function getTjr(){
            Ajax.get(APIURL + '/user/getHpsList', true)
                .then(function(res){
                    if(res.success){
                        var data = res.data, html = "";
                        for(var i = 0; i < data.length; i++){
                            var d = data[i];
                            if(d.userReferee.trim() == ""){
                                toUser = d.userId;
                                break;
                            }
                        }
                    }
                });
        }
        function validate_mobile(){
            var $elem = $("#mobile"),
                $parent = $elem.parent(),
                span;
            if($elem.val() == ""){
                span = $parent.find("span.warning")[0];
                $(span).fadeIn(150).fadeOut(3000);
                return false;
            }else if(!/^1[3,4,5,7,8]\d{9}$/.test($elem.val()) ){
                span = $parent.find("span.warning")[1];
                $(span).fadeIn(150).fadeOut(3000);
                return false;
            }
            return true;
        }
        function validate_captcha(){
            var $elem = $("#captcha"),
                $parent = $elem.parent(),
                span;
            if($elem.val() == ""){
                span = $parent.find("span.warning")[0];
                $(span).fadeIn(150).fadeOut(3000);
                return false;
            }else if(!/^[\d,a-z,A-Z]{4}$/.test($elem.val())){
                span = $parent.find("span.warning")[1];
                $(span).fadeIn(150).fadeOut(3000);
                return false;
            }
            return true;
        }
        function validate_userReferee(){
        	if( (userReferee == undefined || userReferee.trim() == "") &&
                (toUser == undefined || toUser.trim() == "") ){
        		showMsg("推荐人不能为空！");
        		return false;
        	}
        	return true;
        }
        
        function validate(){
            if(validate_mobile() && validate_captcha() && validate_userReferee()){
                return true;
            }
            return false;
        }
        function finalRegister() {
            var param = {
                "loginName": $("#mobile").val(),
                "captcha": $("#captcha").val(),
                "userReferee": userReferee || toUser
            };
            Ajax.post(APIURL + '/user/regist', param)
                .then(function (response) {
                    if (response.success) {
                        showMsg("<div class='tc'>恭喜您注册成功！<br/>稍后登录密码将发送到您的手机上，请注意查收！</div>");
                        setTimeout(function(){
                            if(returnUrl){
                                location.href = "./login.html?return="+encodeURIComponent(returnUrl);
                            }else{
                                location.href = "./login.html";
                            }
                        }, 2100);
                    } else {
                        $("#captchaImg").attr('src', APIURL+'/captcha?_=' + new Date().getTime());
                        showMsg(response.msg);
						$("#registerBtn").removeAttr("disabled").val("注册");
                    }
                });
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

        function register(){
            if(validate()){
                count = 1;
                $("#registerBtn").attr("disabled", "disabled").val("注册中...");
                finalRegister();
            }
        }
	});
});