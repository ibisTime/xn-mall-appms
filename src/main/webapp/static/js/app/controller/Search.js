define([
    'app/controller/base',
    'app/util/ajax',
    'Handlebars'
], function (base, Ajax, Handlebars) {
    $(function () {
		var url = APIURL + "",
			tplCont = __inline("../ui/search-list.handlebars");
        function initView(){
			addListeners();
		}
    	function addListeners(){
    		$("#searchInput").on("keyup", function(){
    			base.throttle(doSearch, this);
    		});
    	}
    	function doSearch(){
    		var iValue = this.value;
    		if(iValue){
    			addLoading();
				Ajax.get(url, {})
					.then(function(res){
						if(res.success){
							var data = res.data;
							if(data.length){
								$(this).html( tplCont({items: data}) );
							}else{
								noData();
							}
						}else{
							doError();
						}
					});
    		}
    	}
    	function addLoading(){
    		$("#searchUl").html('<li class="scroll-loadding"></li>');
    	}
    	function noData(){
    		
    	}
        function doError() {
            $("#searchUl").html('<div class="bg_fff" style="text-align: center;line-height: 150px;">暂无数据</div>');
        }
    });
});