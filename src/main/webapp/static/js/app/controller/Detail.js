define([
    'app/controller/base',
    'app/util/ajax',
    'app/util/dialog'
], function (base, Ajax, dialog) {
    $(function () {
    	var url = APIURL + '/user/business',
			code = base.getUrlParam("c") || ""
    		config = {
				code: code
    	    };

		if(sessionStorage.getItem("user") !== "1"){
            location.href = "../user/login.html?return=" + encodeURIComponent(location.pathname + location.search);
        }else{
            initView();
        }

	    function initView() {
			if(code){
				business();
	        	addListeners();
			}else{
				$("#cont").remove();
				showMsg("未传入商家编号!");
			}
			
	    }
	    function addListeners() {
			$("#dzIcon").on("click", function(){
				praise();
			});
			$("#sbtn").on("click", function(){
				location.href = "./integral_consume.html?c=" + code + "&n=" + $("#name").text();
			});
	    }

	    function praise(){
			var span = $("#totalDzNum");
			$("#loaddingIcon").removeClass("hidden");
	    	Ajax.post(APIURL + "/user/praise", {toMerchant: code})
	            .then(function (response) {
					$("#loaddingIcon").addClass("hidden");
	                if (response.success) {
						span.text(+span.text() + 1);
					}else{
						showMsg(response.msg);
					}
				});
	    }
	    
	    function business(){
	    	Ajax.post(url, config)
	            .then(function (response) {
					$("#cont").remove();
	                if (response.success) {
	                    var data = response.data;
						$("#pic1").attr("src", data.pic1);
						$("#name").text(data.name);
						$("#totalDzNum").text(data.totalDzNum);
						$("#advert").text(data.advert);
						$("#address").text(data.province + " " + data.city + " " + data.area + " " + data.address);
						$("#detailCont").append('<a class="fr clearfix" href="tel://'+data.bookMobile+'"><img class="wp16p va-m" src="/static/images/phone.png"/></a>');
	                }else{
	                	doError();
	                }
	            });
	    }


	    function doError() {
            $("#description").html('<div class="bg_fff tc wp100">暂时无法获取商家信息</div>');
        }
	    
	    function showMsg(cont, time){
    		var d = dialog({
				content: cont,
				quickClose: true
			});
			d.show();
			setTimeout(function () {
				d.close().remove();
			}, time || 2000);
    	}
    });
});