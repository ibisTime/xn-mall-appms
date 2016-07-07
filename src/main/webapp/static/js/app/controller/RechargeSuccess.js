define([
	'app/controller/base',
    'app/util/ajax',
    'app/util/dialog'
], function (base, Ajax, dialog) {
	$(function(){
		Ajax.get(APIURL + "/operators/integral/recharge", {"userId": userId}, true)
			.then(function(res){
				$("#cont").remove();
				if(res.success){
					$("#content").removeClass("hidden");
				}else{
					showMsg(res.msg);
				}
			});
		
		function showMsg(msg){
			var content = "积分充值失败！";
			if(msg.indexOf("登录后") != -1){
				content = msg;
				var d = dialog({
					content: content,
					quickClose: true
				});
				d.show();
				setTimeout(function () {
					d.close().remove();
				}, 2000);
				setTimeout(function(){
					location.href = "../user/login.html?return=" + encodeURIComponent(location.pathname + location.search);
				}, 2000);
			}else{
				var d = dialog({
					content: content,
					quickClose: true
				});
				d.show();
				setTimeout(function () {
					d.close().remove();
				}, 2000);
				setTimeout(function(){
					location.href = "../home/index.html";
				}, 2000);
			}
		}
	});
});