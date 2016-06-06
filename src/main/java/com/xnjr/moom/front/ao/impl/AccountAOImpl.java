/**
 * @Title AccountAOImpl.java 
 * @Package com.ibis.pz.ao.impl 
 * @Description 
 * @author miyb  
 * @date 2015-5-12 下午3:51:21 
 * @version V1.0   
 */
package com.xnjr.moom.front.ao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.IAccountAO;
import com.xnjr.moom.front.exception.BizException;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XN802005Req;
import com.xnjr.moom.front.req.XN802010Req;
import com.xnjr.moom.front.req.XN802020Req;
import com.xnjr.moom.front.req.XN803900Req;
import com.xnjr.moom.front.req.XNfd0032Req;
import com.xnjr.moom.front.req.XNfd0050Req;
import com.xnjr.moom.front.res.Page;

/** 
 * @author: miyb 
 * @since: 2015-5-12 下午3:51:21 
 * @history:
 */
@Service
public class AccountAOImpl implements IAccountAO {
    @Override
    public Object getAccountByUserId(String userId) {
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "账号不能为空");
        }
        return BizConnecter.getBizData("fd0030",
            JsonUtils.string2Json("userId", userId), Object.class);
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Page queryAccountDetail(String userId, String accountNumber,
            String ajNo, String status, String start, String limit,
            String bizType, String refNo, String workDate, String checkUser,
            String dateStart, String dateEnd) {
        if (StringUtils.isBlank(accountNumber)) {
            throw new BizException("A010001", "账号不能为空");
        }
        if (StringUtils.isBlank(start)) {
            throw new BizException("A010001", "页数不能为空");
        }
        if (StringUtils.isBlank(limit)) {
            throw new BizException("A010001", "限制条数不能为空");
        }
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        XN802020Req req = new XN802020Req();
        req.setAccountNumber(accountNumber);
        req.setAjNo(ajNo);
        req.setBizType(bizType);
        req.setCheckUser(checkUser);
        req.setDateEnd(dateEnd);
        req.setDateStart(dateStart);
        req.setLimit(limit);
        req.setRefNo(refNo);
        req.setStart(start);
        req.setStatus(status);
        req.setWorkDate(workDate);
        req.setUserId(userId);
        return BizConnecter.getBizData("XN802020", JsonUtils.object2Json(req),
            Page.class);
    }

    public Page getAccountPageInfos(String userId, String accountNumber,
            String status, String realName, String dateStart, String dateEnd,
            String start, String limit) {
        if (StringUtils.isBlank(start)) {
            throw new BizException("A010001", "页数不能为空");
        }
        if (StringUtils.isBlank(limit)) {
            throw new BizException("A010001", "限制条数不能为空");
        }
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        XN802010Req req = new XN802010Req();
        req.setAccountNumber(accountNumber);
        req.setDateEnd(dateEnd);
        req.setDateStart(dateStart);
        req.setLimit(limit);
        req.setRealName(realName);
        req.setStart(start);
        req.setStatus(status);
        req.setUserId(userId);
        return BizConnecter.getBizData("802010", JsonUtils.object2Json(req),
            Page.class);
    }

    @Override
    public Page queryFrozenDetail(String accountNumber, String bizType,
            String dateStart, String dateEnd, String start, String limit,
            String orderColumn, String orderDir) {
        if (StringUtils.isBlank(accountNumber)) {
            throw new BizException("A010001", "账号不能为空");
        }
        if (StringUtils.isBlank(start)) {
            throw new BizException("A010001", "页数不能为空");
        }
        if (StringUtils.isBlank(limit)) {
            throw new BizException("A010001", "限制条数不能为空");
        }
        XNfd0032Req req = new XNfd0032Req();
        req.setAccountNumber(accountNumber);
        req.setBizType(bizType);
        req.setDateStart(dateStart);
        req.setDateEnd(dateEnd);
        req.setStart(start);
        req.setLimit(limit);
        req.setOrderColumn(orderColumn);
        req.setOrderDir(orderDir);
        return BizConnecter.getBizData("fd0032", JsonUtils.object2Json(req),
            Page.class);
    }

    @Override
    public List queryBankList(String channelNo, String isEnable) {
        if (StringUtils.isBlank(channelNo)) {
            throw new BizException("A010001", "支付通道编号不能为空");
        }
        if (StringUtils.isBlank(isEnable)) {
            throw new BizException("A010001", "启用标示不能为空");
        }
        XN802005Req req = new XN802005Req();
        req.setChannelNo(channelNo);
        req.setIsEnable(isEnable);
        return BizConnecter.getBizData("802005", JsonUtils.object2Json(req),
            List.class);
    }

    @Override
    public Object getSumPP(String userId) {
        XN803900Req req = new XN803900Req();
        req.setUserId(userId);
        return BizConnecter.getBizData("yw4900",
            JsonUtils.string2Json("userId", userId), Object.class);
    }

    @Override
    public Page queryRechargeAndWithdraw(String accountNumber, String status,
            String dateStart, String dateEnd, String start, String limit,
            String orderColumn, String orderDir) {
        XNfd0050Req req = new XNfd0050Req();
        req.setAccountNumber(accountNumber);
        req.setStatus(status);
        req.setDateStart(dateStart);
        req.setDateEnd(dateEnd);
        req.setStart(start);
        req.setLimit(limit);
        req.setOrderColumn(orderColumn);
        req.setOrderDir(orderDir);
        return BizConnecter.getBizData("fd0050", JsonUtils.object2Json(req),
            Page.class);
    }

}
