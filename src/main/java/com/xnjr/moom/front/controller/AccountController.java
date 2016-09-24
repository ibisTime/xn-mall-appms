package com.xnjr.moom.front.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnjr.moom.front.ao.IAccountAO;
import com.xnjr.moom.front.ao.IDictAO;
import com.xnjr.moom.front.ao.IUserAO;
import com.xnjr.moom.front.enums.EBoolean;
import com.xnjr.moom.front.res.Page;
import com.xnjr.moom.front.res.XNlh5034Res;

/** 
 * @author: miyb 
 * @since: 2015-4-14 下午1:41:46 
 * @history:
 */
@Controller
@RequestMapping(value = "/account")
public class AccountController extends BaseController {
    @Autowired
    IAccountAO accountAO;

    @Autowired
    IUserAO userAO;

    @Autowired
    IDictAO dictAO;

    // *********查询账户资产 start****
    @RequestMapping(value = "/get", method = RequestMethod.GET)
    @ResponseBody
    public Object getAccount(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("currency") String currency) {
        return accountAO.getAccountByUserId(getSessionUserId(userId), currency);
    }

    // *********查询账户资产 end****

    // 分页查询账户资料
    @RequestMapping(value = "infos/page", method = RequestMethod.GET)
    @ResponseBody
    public Object getAccountPageInfos(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "accountNumber", required = false) String accountNumber,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "realName", required = false) String realName,
            @RequestParam(value = "dateStart", required = false) String dateStart,
            @RequestParam(value = "dateEnd", required = false) String dateEnd,
            @RequestParam("start") String start,
            @RequestParam("limit") String limit) {
        return accountAO.getAccountPageInfos(getSessionUserId(userId),
            accountNumber, status, realName, dateStart, dateEnd, start, limit);
    }

    // *********查询资金明细start****
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/detail/page", method = RequestMethod.GET)
    @ResponseBody
    public Object queryAccountDetail(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "accountNumber", required = false) String accountNumber,
            @RequestParam(value = "ajNo", required = false) String ajNo,
            @RequestParam("start") String start,
            @RequestParam("limit") String limit,
            @RequestParam(value = "bizType", required = false) String bizType,
            @RequestParam(value = "dateStart", required = false) String dateStart,
            @RequestParam(value = "dateEnd", required = false) String dateEnd) {
        return accountAO.queryAccountDetail(getSessionUserId(userId),
            accountNumber, ajNo, start, limit, bizType, dateStart, dateEnd);
    }

    // *********查询资金明细end****

    // *********查询冻结明细start****
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/frozen/detail/page", method = RequestMethod.POST)
    @ResponseBody
    public Page queryFrozenDetail(
            @RequestParam(value = "bizType", required = false) String bizType,
            @RequestParam(value = "dateStart", required = false) String dateStart,
            @RequestParam(value = "dateEnd", required = false) String dateEnd,
            @RequestParam("start") String start,
            @RequestParam("limit") String limit,
            @RequestParam(value = "orderColumn", required = false) String orderColumn,
            @RequestParam(value = "orderDir", required = false) String orderDir) {
        return accountAO.queryFrozenDetail(getSessionUser().getAccountNumber(),
            bizType, dateStart, dateEnd, start, limit, orderColumn, orderDir);
    }

    // *********查询冻结明细end****

    // *********查询充值取现start****
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/randw/page", method = RequestMethod.POST)
    @ResponseBody
    public Page queryRechargeAndWithdraw(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "dateStart", required = false) String dateStart,
            @RequestParam(value = "dateEnd", required = false) String dateEnd,
            @RequestParam("start") String start,
            @RequestParam("limit") String limit,
            @RequestParam(value = "orderColumn", required = false) String orderColumn,
            @RequestParam(value = "orderDir", required = false) String orderDir) {
        return accountAO.queryRechargeAndWithdraw(getSessionUser()
            .getAccountNumber(), status, dateStart, dateEnd, start, limit,
            orderColumn, orderDir);
    }

    // *********查询充值取现end****

    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/doWithdraw", method = RequestMethod.POST)
    @ResponseBody
    public Object withdraw(@RequestParam("accountNumber") String accountNumber,
            @RequestParam("amount") String amount,
            @RequestParam(value = "toType", required = false) String toType,
            @RequestParam("toCode") String toCode,
            @RequestParam("toBelong") String toBelong) {
        return accountAO.withdraw(accountNumber, amount, toType, toCode,
            toBelong);
    }

    // *********获取银行列表 start****

    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/bank/list", method = RequestMethod.GET)
    @ResponseBody
    public List queryBankList(@RequestParam("channelNo") String channelNo) {
        return accountAO.queryBankList(channelNo, EBoolean.YES.getCode());
    }

    // *********获取银行列表 end****
    // 获取用户累计本金和累计收益
    @RequestMapping(value = "/sumpp", method = RequestMethod.GET)
    @ResponseBody
    public Object getSumPP(
            @RequestParam(value = "userId", required = false) String userId) {
        return accountAO.getSumPP(getSessionUserId(userId));
    }

    // 线下充值
    @RequestMapping(value = "/doRecharge", method = RequestMethod.POST)
    @ResponseBody
    public Object recharge(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("accountNumber") String accountNumber,
            @RequestParam("amount") String amount,
            @RequestParam(value = "fromType", required = false) String fromType,
            @RequestParam("fromCode") String fromCode) {
        return accountAO.recharge(getSessionUserId(userId), accountNumber,
            amount, fromType, fromCode);
    }

    // 购买积分
    @RequestMapping(value = "/buyIntegral", method = RequestMethod.POST)
    @ResponseBody
    public Object buyIntegral(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("amount") String amount,
            @RequestParam(value = "cnyAmount", required = false) String cnyAmount) {
        XNlh5034Res res = dictAO.queryDictByKey(getSessionUserId(userId),
            "GMJFDH_RATE");
        BigDecimal big1 = new BigDecimal(amount);
        BigDecimal big2 = new BigDecimal(res.getValue());

        cnyAmount = (int) (big1.multiply(big2).doubleValue()) + "";
        return accountAO.buyIntegral(getSessionUserId(userId), amount,
            cnyAmount);
    }
}
