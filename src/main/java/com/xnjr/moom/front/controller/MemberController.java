package com.xnjr.moom.front.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnjr.moom.front.ao.IAccountAO;
import com.xnjr.moom.front.ao.IBankCardAO;
import com.xnjr.moom.front.ao.ISmsAO;
import com.xnjr.moom.front.ao.IUserAO;
import com.xnjr.moom.front.enums.ETermType;
import com.xnjr.moom.front.localToken.OrderNoGenerater;
import com.xnjr.moom.front.localToken.TokenDO;
import com.xnjr.moom.front.localToken.User;
import com.xnjr.moom.front.localToken.UserDAO;
import com.xnjr.moom.front.res.XNfd0001Res;
import com.xnjr.moom.front.res.XNfd0002Res;
import com.xnjr.moom.front.session.ISessionProvider;
import com.xnjr.moom.front.session.SessionUser;

@Controller
@RequestMapping(value = "/user")
public class MemberController extends BaseController {
    @Autowired
    IUserAO userAO;

    @Autowired
    UserDAO userDAO;

    @Autowired
    IAccountAO accountAO;

    @Autowired
    IBankCardAO bankCardAO;

    @Autowired
    ISmsAO smsAO;

    // ****主流程start************
    @RequestMapping(value = "/mobile/check", method = RequestMethod.POST)
    @ResponseBody
    public boolean checkMobileExist(@RequestParam("loginName") String mobile) {
        userAO.checkMobileExit(mobile);
        return true;
    }

    @RequestMapping(value = "/regist", method = RequestMethod.POST)
    @ResponseBody
    public XNfd0001Res doRegister(
            @RequestParam("loginName") String mobile,
            @RequestParam("loginPwd") String loginPwd,
            @RequestParam("loginCaptcha") String loginCaptcha,
            @RequestParam(value = "userReferee", required = false) String userReferee) {
        XNfd0001Res user = userAO.doRegister(mobile, loginPwd, getRemoteHost(),
            userReferee, loginCaptcha);
        return user;
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public Object doLogin(@RequestParam("terminalType") String terminalType,
            @RequestParam("loginName") String loginName,
            @RequestParam("loginPwd") String loginPwd) {
        XNfd0002Res res = userAO.doLogin(loginName, loginPwd, getRemoteHost());
        if (ETermType.WEB.getCode().equals(terminalType)) {
            SessionUser sessionUser = new SessionUser();
            sessionUser.setUserId(res.getUserId());
            // 创建session
            sessionProvider.setUserDetail(sessionUser);
        } else if (ETermType.APP.getCode().equals(terminalType)) {
            TokenDO tokenDO = new TokenDO();
            String userId = res.getUserId();

            // userId是否存在
            User user = userDAO.getUser(userId);
            if (user != null) {
                userDAO.del(userId);
            }
            String tokenId = OrderNoGenerater.generateM(userId);
            // userId,tokenId保存在本地
            User userdo = new User();
            userdo.setUserId(userId);
            userdo.setTokenId(tokenId);
            userDAO.saveUser(userdo);

            tokenDO.setTokenId(tokenId);
            tokenDO.setUserId(userId);
            // return tokenDO给app客户端

            return tokenDO;
        }
        return true;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public Object doGetUser(
            @RequestParam(value = "userId", required = false) String userId) {
        return userAO.doGetUser(getSessionUserId(userId));
    }

    @RequestMapping(value = "/identify", method = RequestMethod.POST)
    @ResponseBody
    public boolean doIdentify(@RequestParam("idNo") String idNO,
            @RequestParam("realName") String realName,
            @RequestParam(value = "userId", required = false) String userId) {
        userAO.doIdentify(getSessionUserId(userId), realName, "1", idNO);
        return true;
    }

    @RequestMapping(value = "/rich", method = RequestMethod.POST)
    @ResponseBody
    public boolean doRich(@RequestParam("idNo") String idNO,
            @RequestParam("realName") String realName,
            @RequestParam("tradePwd") String tradePwd,
            @RequestParam("tradeCaptcha") String tradeCaptcha,
            @RequestParam(value = "userId", required = false) String userId) {
        userAO.doIdentifySetTradePwd(getSessionUserId(userId), realName, "1",
            idNO, tradePwd, tradeCaptcha);
        return true;
    }

    @RequestMapping(value = "/log", method = RequestMethod.GET)
    @ResponseBody
    public Object doGetLog(
            @RequestParam(value = "userId", required = false) String userId) {
        return userAO.doGetLog(getSessionUserId(userId));
    }

    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    @ResponseBody
    public boolean logout() {
        sessionProvider.removeAttribute(ISessionProvider.SESSION_KEY_USER);
        return true;
    }

    // ****主流程end************

    // ****银行卡start**********
    @RequestMapping(value = "/bankcard/bind", method = RequestMethod.POST)
    @ResponseBody
    public boolean doBindBankCard(
            @RequestParam("bankCode") String bankCode,
            @RequestParam("bankcardNo") String bankcardNo,
            @RequestParam(value = "subbranch", required = false) String subbranch,
            @RequestParam(value = "userId", required = false) String userId) {
        // 验证是否实名
        String uId = getSessionUserId(userId);
        boolean flag = userAO.doIdentityCheck(uId);
        // 三方验证和保存用户卡 未完待续
        bankCardAO.doBindBankCard(uId, bankCode, bankcardNo, subbranch);
        flag = true;
        return flag;
    }

    @RequestMapping(value = "/bankcard/list", method = RequestMethod.GET)
    @ResponseBody
    public Object queryBankCardList(
            @RequestParam(value = "userId", required = false) String userId) {
        return bankCardAO.queryBankCardList(getSessionUserId(userId));
    }

    @RequestMapping(value = "/bankcard/page", method = RequestMethod.GET)
    @ResponseBody
    public Object queryBankCardPage(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "start", required = false) String start,
            @RequestParam(value = "limit", required = false) String limit,
            @RequestParam(value = "orderColumn", required = false) String orderColumn,
            @RequestParam(value = "orderDir", required = false) String orderDir) {
        return bankCardAO.queryBankCardPage(getSessionUserId(userId), start,
            limit, orderColumn, orderDir);
    }

    @RequestMapping(value = "/bankcard/detail", method = RequestMethod.GET)
    @ResponseBody
    public Object queryBankCard(@RequestParam(value = "id") String id) {
        return bankCardAO.doViewBankCard(id);
    }

    // 删除银行卡
    @RequestMapping(value = "/bankcard/drop", method = RequestMethod.POST)
    @ResponseBody
    public Object dropBankCard(
            @RequestParam(value = "id", required = false) String id,
            @RequestParam(value = "userId", required = false) String userId) {
        return bankCardAO.doDropBankCard(id, getSessionUserId(userId));
    }

    // 修改银行卡
    @RequestMapping(value = "/bankcard/edit", method = RequestMethod.POST)
    @ResponseBody
    public Object editBankCard(
            @RequestParam(value = "id", required = false) String id,
            @RequestParam(value = "bankCode", required = false) String bankCode,
            @RequestParam(value = "subbranch", required = false) String subbranch,
            @RequestParam(value = "bankCardNo", required = false) String bankCardNo,
            @RequestParam(value = "userId", required = false) String userId) {
        return bankCardAO.doEditBankCard(id, getSessionUserId(userId),
            bankCode, bankCardNo, subbranch);
    }

    // ****银行卡end**********

    // ****登陆密码start******
    @RequestMapping(value = "/loginpwd/reset", method = RequestMethod.POST)
    @ResponseBody
    public boolean doResetLoginPwd(@RequestParam("oldLoginPwd") String oldPwd,
            @RequestParam("newLoginPwd") String newPwd,
            @RequestParam(value = "userId", required = false) String userId) {
        userAO.doResetLoginPwd(getSessionUserId(userId), oldPwd, newPwd);
        // 重新登陆
        return logout();
    }

    @RequestMapping(value = "/loginpwd/find", method = RequestMethod.POST)
    @ResponseBody
    public boolean doFindLoginPwd(@RequestParam("mobile") String mobile,
            @RequestParam("smsCaptcha") String smsCaptcha,
            @RequestParam("newPwd") String newPwd) {
        userAO.doFindLoginPwd(mobile, newPwd, smsCaptcha);
        return true;
    }

    // ****登陆密码end******
    // ****交易密码start****
    @RequestMapping(value = "/tradepwd/set", method = RequestMethod.POST)
    @ResponseBody
    public boolean doSetTradePwd(@RequestParam("tradePwd") String tradePwd,
            @RequestParam("tradeCaptcha") String tradeCaptcha,
            @RequestParam(value = "userId", required = false) String userId) {
        userAO.doSetTradePwd(getSessionUserId(userId), tradePwd, tradeCaptcha);
        return true;
    }

    @RequestMapping(value = "/tradepwd/reset", method = RequestMethod.POST)
    @ResponseBody
    public boolean doResetTradePwd(
            @RequestParam("oldTradePwd") String oldTradePwd,
            @RequestParam("newTradePwd") String newTradePwd,
            @RequestParam(value = "userId", required = false) String userId) {
        userAO.doResetTradePwd(getSessionUserId(userId), oldTradePwd,
            newTradePwd);
        return true;
    }

    @RequestMapping(value = "/tradepwd/find", method = RequestMethod.POST)
    @ResponseBody
    public boolean doFindTradePwd(
            @RequestParam("newTradePwd") String newTradePwd,
            @RequestParam("smsCaptcha") String smsCaptcha,
            @RequestParam("idNo") String idNo,
            @RequestParam(value = "userId", required = false) String userId) {
        userAO.doFindTradePwd(getSessionUserId(userId), newTradePwd,
            smsCaptcha, "1", idNo);
        return true;
    }

    // ****交易密码end****
    // **** 换手机号start************
    @RequestMapping(value = "/mobile/change", method = RequestMethod.POST)
    @ResponseBody
    public boolean doChangeMobile(@RequestParam("newMobile") String newMobile,
            @RequestParam("smsCaptcha") String smsCaptcha,
            @RequestParam("tradePwd") String tradePwd,
            @RequestParam(value = "userId", required = false) String userId) {

        userAO.doChangeMoblie(getSessionUserId(userId), newMobile, smsCaptcha,
            tradePwd);
        return true;
    }

    // **** 换手机号end************
    @RequestMapping(value = "/kyc", method = RequestMethod.GET)
    @ResponseBody
    public Object doKyc(
            @RequestParam(value = "userId", required = false) String userId) {
        return userAO.doKyc(getSessionUserId(userId));
    }
}
