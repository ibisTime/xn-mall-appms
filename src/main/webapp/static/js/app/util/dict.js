define([
    'app/controller/base',
    'app/util/ajax'
], function(base, ajax) {
    var dict = {
        receiptType: {
                "1": "个人",
                "2": "企业"
        },
        fastMail: {
            "EMS": "邮政EMS",
            "STO": "申通快递",
            "ZTO": "中通快递",
            "YTO": "圆通快递",
            "HTKY": "汇通快递",
            "ZJS": "宅急送",
            "SF": "顺丰快递",
            "TTKD": "天天快递"
        },
        fundType: {
            "11": "充值",
            "-11": "取现",
            "12": "转入",
            "-12": "转出",
            "19": "蓝补",
            "-19": "红冲",
            "-110": "取现冻结",
            "-111": "取现解冻",
            '21': '注册送积分',
            '-21': '注册扣积分',
            '22': '活动送积分',
            '-22': '扣除积分'
        },
        orderStatus: {
            "1": "待支付",
            "2": "待发货",
            "3": "待收货",
            "4": "已收货",
            "5": "已完成"
        },
        currencyUnit: {
            '': '',
            'USB': '$',
            'CNY': '￥',
            'XB': 'S$',
            'SGD': 'S$'
        },
        category: {
            "1": "日用品"
        },
        category2Type:{
            "1": {
                "1": "咖啡机",
                "2": "奶泡机",
                "3": "饮水机",
                "4": "配件"
            }
        }
    };

    var changeToObj = function(data) {
        var data = data || [], obj = {};
        data.forEach(function(item) {
            obj[item.dkey] = item.dvalue;
        });
        return obj;
    };

    return {
        get: function(code) {
            return dict[code];
        }
    }
});