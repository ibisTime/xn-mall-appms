package com.xnjr.moom.front.ao.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.IUserAO;
import com.xnjr.moom.front.exception.BizException;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XN801209Req;
import com.xnjr.moom.front.req.XN801212Req;
import com.xnjr.moom.front.req.XNfd0000Req;
import com.xnjr.moom.front.req.XNfd0001Req;
import com.xnjr.moom.front.req.XNfd0002Req;
import com.xnjr.moom.front.req.XNfd0003Req;
import com.xnjr.moom.front.req.XNfd0004Req;
import com.xnjr.moom.front.req.XNfd0005Req;
import com.xnjr.moom.front.req.XNfd0006Req;
import com.xnjr.moom.front.req.XNfd0007Req;
import com.xnjr.moom.front.req.XNfd0008Req;
import com.xnjr.moom.front.res.XN801208Res;
import com.xnjr.moom.front.res.XN801209Res;
import com.xnjr.moom.front.res.XN801211Res;
import com.xnjr.moom.front.res.XN801212Res;
import com.xnjr.moom.front.res.XN801215Res;
import com.xnjr.moom.front.res.XNfd0001Res;
import com.xnjr.moom.front.res.XNfd0002Res;
import com.xnjr.moom.front.res.XNfd0003Res;
import com.xnjr.moom.front.res.XNfd0005Res;
import com.xnjr.moom.front.res.XNfd0006Res;
import com.xnjr.moom.front.res.XNfd0009Res;
import com.xnjr.moom.front.util.PwdUtil;

/** 
 * @author: miyb 
 * @since: 2015-5-12 下午2:53:12 
 * @history:
 */
@Service
public class UserAOImpl implements IUserAO {

    @Override
    public XNfd0001Res doRegister(String mobile, String loginPwd,
            String registerIp, String userReferee, String smsCaptcha) {
        if (StringUtils.isBlank(mobile)) {
            throw new BizException("A010001", "手机号码不能为空");
        }
        if (StringUtils.isBlank(loginPwd)) {
            throw new BizException("A010001", "登陆密码不能为空");
        }
        if (StringUtils.isBlank(registerIp)) {
            throw new BizException("A010001", "注册IP不能为空");
        }
        if (StringUtils.isBlank(smsCaptcha)) {
            throw new BizException("A010001", "验证码不能为空");
        }
        XNfd0001Req req = new XNfd0001Req();
        req.setMobile(mobile);
        req.setSmsCaptcha(smsCaptcha);
        req.setLoginPwd(loginPwd);
        req.setLoginPwdStrength(PwdUtil.calculateSecurityLevel(loginPwd));
        req.setRegisterIp(registerIp);
        req.setUserReferee(userReferee);
        return BizConnecter.getBizData("fd0001", JsonUtils.object2Json(req),
            XNfd0001Res.class);

    }

    @Override
    public void doIdentify(String userId, String realName, String idKind,
            String idNo) {
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        if (StringUtils.isBlank(realName)) {
            throw new BizException("A010001", "真实姓名不能为空");
        }
        if (StringUtils.isBlank(idKind)) {
            throw new BizException("A010001", "证件类型不能为空");
        }
        if (StringUtils.isBlank(idNo)) {
            throw new BizException("A010001", "证件号不能为空");
        }
        XNfd0004Req req = new XNfd0004Req();
        req.setUserId(userId);
        req.setRealName(realName);
        req.setIdKind(idKind);
        req.setIdNo(idNo);
        BizConnecter.getBizData("fd0004", JsonUtils.object2Json(req),
            Object.class);
    }

    @Override
    public void doSetTradePwd(String userId, String tradePwd, String smsCaptcha) {
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        if (StringUtils.isBlank(tradePwd)) {
            throw new BizException("A010001", "安全密码不能为空");
        }
        if (StringUtils.isBlank(smsCaptcha)) {
            throw new BizException("A010001", "验证码不能为空");
        }
        XNfd0005Req req = new XNfd0005Req();
        req.setUserId(userId);
        req.setTradePwd(tradePwd);
        req.setTradePwdStrength(PwdUtil.calculateSecurityLevel(tradePwd));
        req.setSmsCaptcha(smsCaptcha);
        BizConnecter.getBizData("fd0005", JsonUtils.object2Json(req),
            XNfd0005Res.class);
    }

    @Override
    public XNfd0002Res doLogin(String loginName, String loginPwd, String loginIp) {
        if (StringUtils.isBlank(loginName)) {
            throw new BizException("A010001", "登陆名不能为空");
        }
        if (StringUtils.isBlank(loginPwd)) {
            throw new BizException("A010001", "登陆密码不能为空");
        }
        if (StringUtils.isBlank(loginIp)) {
            throw new BizException("A010001", "登陆IP不能为空");
        }
        XNfd0002Req req = new XNfd0002Req();
        req.setLoginName(loginName);
        req.setLoginPwd(loginPwd);
        req.setLoginIp(loginIp);
        return BizConnecter.getBizData("fd0002", JsonUtils.object2Json(req),
            XNfd0002Res.class);
    }

    @Override
    public XNfd0009Res doGetUser(String userId) {
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        return BizConnecter.getBizData("fd0009",
            JsonUtils.string2Json("userId", userId), XNfd0009Res.class);
    }

    @Override
    public void doFindLoginPwd(String mobile, String newLoginPwd,
            String smsCaptcha) {
        if (StringUtils.isBlank(mobile)) {
            throw new BizException("A010001", "手机号不能为空");
        }
        if (StringUtils.isBlank(smsCaptcha)) {
            throw new BizException("A010001", "手机验证码不能为空");
        }
        if (StringUtils.isBlank(newLoginPwd)) {
            throw new BizException("A010001", "新登录密码不能为空");
        }
        XNfd0007Req req = new XNfd0007Req();
        req.setMobile(mobile);
        req.setSmsCaptcha(smsCaptcha);
        req.setNewLoginPwd(newLoginPwd);
        req.setNewLoginPwdStrength(PwdUtil.calculateSecurityLevel(newLoginPwd));
        BizConnecter.getBizData("fd0007", JsonUtils.object2Json(req),
            XN801208Res.class);
    }

    @Override
    public void doResetLoginPwd(String userId, String oldLoginPwd,
            String newLoginPwd) {
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "userId不能为空");
        }
        if (StringUtils.isBlank(oldLoginPwd)) {
            throw new BizException("A010001", "原登录密码不能为空");
        }
        if (StringUtils.isBlank(newLoginPwd)) {
            throw new BizException("A010001", "新登录密码不能为空");
        }
        XN801209Req req = new XN801209Req();
        req.setUserId(userId);
        req.setOldLoginPwd(oldLoginPwd);
        req.setNewLoginPwd(newLoginPwd);
        BizConnecter.getBizData("801209", JsonUtils.object2Json(req),
            XN801209Res.class);
    }

    @Override
    public void doFindTradePwd(String userId, String newTradePwd,
            String smsCaptcha, String idKind, String idNo) {
        XNfd0008Req req = new XNfd0008Req();
        req.setUserId(userId);
        req.setTradePwd(newTradePwd);
        req.setTradePwdStrength(PwdUtil.calculateSecurityLevel(newTradePwd));
        req.setSmsCaptcha(smsCaptcha);
        req.setIdKind(idKind);
        req.setIdNo(idNo);
        BizConnecter.getBizData("fd0008", JsonUtils.object2Json(req),
            XN801211Res.class);
    }

    @Override
    public void doResetTradePwd(String userId, String oldTradePwd,
            String newTradePwd) {
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "userId不能为空");
        }
        if (StringUtils.isBlank(oldTradePwd)) {
            throw new BizException("A010001", "原交易密码不能为空");
        }
        if (StringUtils.isBlank(newTradePwd)) {
            throw new BizException("A010001", "新交易密码不能为空");
        }
        XN801212Req req = new XN801212Req();
        req.setUserId(userId);
        req.setOldTradePwd(oldTradePwd);
        req.setNewTradePwd(newTradePwd);
        BizConnecter.getBizData("801212", JsonUtils.object2Json(req),
            XN801212Res.class);
    }

    @Override
    public void doChangeMoblie(String userId, String newMobile,
            String smsCaptcha, String tradePwd) {
        XNfd0006Req req = new XNfd0006Req();
        req.setUserId(userId);
        req.setNewMobile(newMobile);
        req.setSmsCaptcha(smsCaptcha);
        req.setTradePwd(tradePwd);
        BizConnecter.getBizData("fd0006", JsonUtils.object2Json(req),
            XNfd0006Res.class);
    }

    @Override
    public boolean doIdentityCheck(String userId) {
        boolean flag = true;
        XNfd0009Res user = this.doGetUser(userId);
        if (StringUtils.isBlank(user.getIdKind())
                || StringUtils.isBlank(user.getIdNo())) {
            flag = false;
        }
        return flag;
    }

    @Override
    public Object doGetLog(String userId) {
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        return BizConnecter.getBizData("fd0010",
            JsonUtils.string2Json("userId", userId), Object.class);
    }

    @Override
    public void checkMobileExit(String mobile) {
        if (StringUtils.isBlank(mobile)) {
            throw new BizException("A010001", "手机号不能为空");
        }
        XNfd0000Req req = new XNfd0000Req();
        req.setMobile(mobile);
        BizConnecter.getBizData("fd0000", JsonUtils.object2Json(req),
            XN801215Res.class);
    }

    @Override
    public void doIdentifySetTradePwd(String userId, String realName,
            String idKind, String idNO, String tradePwd, String tradeCaptcha) {
        XNfd0003Req req = new XNfd0003Req();
        req.setUserId(userId);
        req.setIdKind(idKind);
        req.setIdNo(idNO);
        req.setRealName(realName);
        req.setSmsCaptcha(tradeCaptcha);
        req.setTradePwd(tradePwd);
        req.setTradePwdStrength(PwdUtil.calculateSecurityLevel(tradePwd));
        BizConnecter.getBizData("fd0003", JsonUtils.object2Json(req),
            XNfd0003Res.class);
    }

    /** 
     * @see com.xnjr.moom.front.ao.ICompanyAO#doKyc(java.lang.String)
     */
    @Override
    public Object doKyc(String userId) {
        return BizConnecter.getBizData("fd2900",
            JsonUtils.string2Json("userId", userId), Object.class);
    }
}
