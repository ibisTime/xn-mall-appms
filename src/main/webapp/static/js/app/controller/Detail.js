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
    	initView();

	    function initView() {
			if(code){
				business();
	        	addListeners();
			}else{
				$("#cont").remove();
			}
			
	    }
	    function addListeners() {
			$("#dzIcon").on("click", function(){
				praise();
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
						showMsg("非常遗憾，点赞失败!");
					}
				});
	    }
	    
	    function business(){
	    	Ajax.post(url, config)
	            .then(function (response) {
					$("#cont").remove();
	                if (response.success) {
	                    var data = response.data;
						$("#pic2").attr("src", data.pic2);
						$("#name").text(data.name);
						$("#totalDzNum").text(data.totalDzNum);
						$("#advert").text(data.advert);
						$("#address").text(data.province + " " + data.city + " " + data.area + " " + data.address);
						$("#detailCont").append('<a class="fr clearfix" href="tel://'+data.bookMoible+'"><img class="wp16p va-m" src="../../images/phone.png"/></a>');
						//$("#bookMoible").attr("href", "tel://" + data.bookMoible);
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