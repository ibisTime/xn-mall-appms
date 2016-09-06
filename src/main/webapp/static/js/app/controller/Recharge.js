define([
    'app/controller/base',
    'app/util/dict',
    'app/util/dialog'
], function (base, dict, dialog) {
    $(function () {
        init();
        
        function init(){
            addListeners();
        }
        
        function addListeners(){
        	function copy(text) {
        		var $ct = $("#copyText");
        		$ct && $ct.remove();
        		var textarea = document.createElement("textarea");
				textarea.style.position = 'fixed';
				textarea.style.top = 0;
				textarea.style.left = 0;
				textarea.style.border = 'none';
				textarea.style.outline = 'none';
				textarea.style.resize = 'none';
				textarea.style.background = 'transparent';
				textarea.style.color = 'transparent';
				textarea.id = '';
				textarea.value = text;
				document.body.appendChild(textarea);
				textarea.select();
				try {
					document.execCommand('copy') ? 'successful' : 'unsuccessful';
					showMsg("复制成功！");
				} catch (err) {
					showMsg("复制失败，请手动长按复制！");
				}
				document.body.removeChild(textarea);
        	}
        	$("#copy").on("click", function(){
        		copy($("#account").text());
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
            }, 1500);
        }
    });
});
