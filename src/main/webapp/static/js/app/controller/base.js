define(['app/util/common', 'app/util/ajax'], function (common, Ajax) {

    //FastClick.attach(document.body);

    // element disabled
    $.fn.disable = function () {
        this.addClass('disabled');
        this[0].disabled = true;
    };

    $.fn.enable = function () {
        this.removeClass('disabled');
        this[0].disabled = false;
    };

    $.fn.tap = function (callback) {
        this.addClass('btn_press');
        this.on('click', function () {
            callback(this);
        });
    };

    // setData
    $.fn.setData = function(data) {
        var data = data || {};
        for (var k in data) {
            $('[data-name='+k+']', this).html(data[k]);
        }
    };

    if (Number.prototype.toFixed) {
        var ori_toFixed = Number.prototype.toFixed;
        Number.prototype.toFixed = function () {
            var num = ori_toFixed.apply(this, arguments);
            if (num == 0 && num.indexOf('-') == 0) { // -0 and 0
                num = num.slice(1);
            }
            return num;
        }
    }

    String.prototype.temp = function (obj) {
        return this.replace(/\$\w+\$/gi, function (matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return (returns + "") == "undefined" ? "" : returns;
        });
    };

    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };

    $.prototype.serializeObject = function () {
        var a, o, h, i, e;
        a = this.serializeArray();
        o = {};
        h = o.hasOwnProperty;
        for (i = 0; i < a.length; i++) {
            e = a[i];
            if (!h.call(o, e.name)) {
                o[e.name] = e.value;
            }
        }
        return o;
    };
    var Base = {
        staticUrl: requirejs.staticUrl,
        back: window.history.back,
        loadAllTpl: '<div class="all-bar tc bg_fff ptb4"><span class="sr-only">已加载全部</span></div>',
        loadingTpl: '<div class="loading-bar tc"><i class="fa fa-spinner fa-spin fa-3x fa-fw margin-bottom"></i><span class="sr-only">努力加载中...</span></div>',
        loadEmptyTpl: '<div class="flex flex-c flex-dv t_bd hp100"><i class="s_50 fa fa-calendar-o" aria-hidden="true"></i><span class="mt10">暂无相关数据</span></div>',
        loading100Tpl: '<div class="flex flex-c flex-dv hp100 loading-bar"><img src="'+requirejs.staticUrl+'/images/pull.gif"/><span class="sr-only">努力加载中...</span></div>',
        // simple encrypt information with ***
        encodeInfo: function (info, headCount, tailCount, space) {
            headCount = headCount || 0;
            tailCount = tailCount || 0;
            info = info.trim();
            var header = info.slice(0, headCount),
                len = info.length,
                tailer = info.slice(len - tailCount),
                mask = '**************************************************', // allow this length
                maskLen = len - headCount - tailCount;
            if (space) {
                mask = '**** **** **** **** **** **** **** **** **** **** **** ****';
            }
            return maskLen > 0 ? (header + mask.substring(0, maskLen + (space? maskLen / 4 : 0)) + (space? ' ' : '') + tailer) : info;
        },
        getUrlParam : function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]);
            return '';
        },
        findObj: function(array, key, value, key2, value2) {
            var i = 0, len = array.length,
                res;
            for (i; i < len; i++) {
                if (array[i][key] == value && !key2) {
                    return array[i];
                } else if (key2 && array[i][key] == value && array[i][key2] == value2) {
                    return array[i];
                }
            }
        },
        fmoney: function (s, n) {
            if (typeof s == 'undefined') {
                return '0.00';
            }
            n = n > 0 && n <= 20 ? n : 0;
            s = +((s / 1000).toFixed(n));
            var unit = '';
            if (('' + s).split('.')[0].length >= 5) {
                s = +((s / 10000).toFixed(n));
                unit = '万';
            }

            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            var l = s.split(".")[0].split("").reverse(),
                r = s.split(".")[1] || '';
            t = "";
            for(i = 0; i < l.length; i ++ )
            {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }
            return t.split("").reverse().join("") + (n == 0 ? "" : ("." + r)) + unit;
        },
        getUser: function (flag) {
            return Ajax.get(APIURL + '/user');
        },
        throttle: function(method, context, t) {
        	var tt = t || 100;
        	clearTimeout(method.tId);
        	method.tId = setTimeout(function(){
        		method.call(context);
        	}, tt)
        }
    };
    var pathname = location.pathname;
    if( (pathname.indexOf("/user/") != -1 &&
         (pathname.indexOf("/user/login.html") == -1 && pathname.indexOf("/user/register.html") == -1 
          && pathname.indexOf("/user/findPwd.html") == -1)) 
        || pathname.indexOf("/account") != -1 
        || (pathname.indexOf("/operator/") != -1 && pathname.indexOf("/operator/buy.html") == -1)){
    	if(sessionStorage.getItem("user") == "0"){
    		location.href = "../user/login.html?return=" + encodeURIComponent(location.pathname + location.search);
            sessionStorage.setItem("trade", "0");
    	}else if(sessionStorage.getItem("user") == undefined){
    		Base.getUser().then(function(response){
                if(!response.success){
                	sessionStorage.setItem("user", "0");
                    sessionStorage.setItem("trade", "0");
                    location.href = "../user/login.html?return=" + encodeURIComponent(location.pathname + location.search);
                }else{
                    var data = response.data;
                	sessionStorage.setItem("user", "1");
                	location.reload(true);
                }
            });
    	}
    }
    return Base;
});