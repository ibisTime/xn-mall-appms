define([
    'app/controller/base',
    'app/util/ajax',
    'lib/fingerprint2',
], function(base, Ajax, Fingerprint2) {
    var shakeStatus = 0;//1为已超过次数，0为未超过次数
    var user = sessionStorage.getItem("user");
    var token = sessionStorage.getItem("token");
    var userId = sessionStorage.getItem("userId");
    var longitude = sessionStorage.getItem("longitude");
    var latitude = sessionStorage.getItem("latitude");
   	var fingerprint;
    new Fingerprint2().get(function(result){
		
		fingerprint = result; //a hash, representing your device fingerprint
    	init();
	});

    function init(){
        getShakeList();
        addListener();
    }
    function addListener(){
        $("#content").on("click", "li", function(){
            var me = $(this);
//          var flagHb = base.getUserBrowser();
//  		if(flagHb){
    			location.href = "./shake-share.html?hCode="+ me.attr("hCode")+"&distance=" + me.attr("distance") + "&hasName=" + me.attr("hasName") +"&flagHb=2";
//  		}else{
//  			location.href = "./shake-share.html?hCode=" + me.attr("hCode")+"&distance=" + me.attr("distance") + "&hasName=" + me.attr("hasName");
//  		}
        });
    }
    function getShakeList(){
        var param = {
            "longitude": longitude,
            "latitude": latitude,
            "userId": userId,
            "deviceNo": fingerprint,
            "companyCode": SYSTEM_CODE,
            "token": token
        }

        Ajax.post("615117",{json:param})
            .then(function (res) {
                if(res.success){
                    var lists = res.data, html = "";
                    $.each(lists,function (i,val) {
	    				var hasName = val.user.mobile.substring(0, 3) + "*****" + val.user.mobile.substring(8, 11);
                        var distance = val.distance, distance1 = distance;
//                      var shareUrl = val.shareUrl;
                        var hcode = val.code;
                        if(distance<200){
                            distance1 = "小于200";
                        }

                        html += '<li class="shakeList wp100 b_bd_b over-hide p3_2r bg_fff" hCode="'+hcode+'" hasName="'+hasName+'" distance="'+distance+
                            	'"><div class="fl c_48 fs25r">'+hasName+'<samp class="c_fe4332 fs25r">的摇钱树</samp></div>'+
                            	'<div class="fr c_48 fs25r"><img class="h35r pr6r" src="/static/images/距离.png">'+distance1+'m</div>'+
                            '</li>';
                    });
                    $(".nearTree").html(html);
                }else{
                   base.showMsg(res.msg)
                }
            });
    }
});
