package com.xnjr.moom.front.ao.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.IOperatorAO;
import com.xnjr.moom.front.exception.BizException;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XN602020Req;
import com.xnjr.moom.front.req.XN602022Req;
import com.xnjr.moom.front.req.XN602023Req;
import com.xnjr.moom.front.req.XN602025Req;
import com.xnjr.moom.front.req.XN602026Req;
import com.xnjr.moom.front.req.XN602027Req;
import com.xnjr.moom.front.req.XN805041Req;
import com.xnjr.moom.front.res.XN805041Res;
import com.xnjr.moom.front.util.PwdUtil;

@Service
public class OperatorAOImpl implements IOperatorAO {

	public Object submitOrder(String applyUser, String modelCode, String quantity, 
			String salePrice, String addressCode, String applyNote,
			String receiptType, String receiptTitle){
		
	 	if (StringUtils.isBlank(applyUser)) {
            throw new BizException("A010001", "申请人编号不能为空");
        }
        if (StringUtils.isBlank(modelCode)) {
            throw new BizException("A010001", "型号编号不能为空");
        }
        if (StringUtils.isBlank(quantity)) {
            throw new BizException("A010001", "数量不能为空");
        }
        if( StringUtils.isBlank(salePrice) ){
        	throw new BizException("A010001", "单价不能为空");
        }
        if( StringUtils.isBlank(addressCode) ){
        	throw new BizException("A010001", "收货信息编号不能为空");
        }
        XN602020Req req = new XN602020Req();
        req.setAddressCode(addressCode);
        req.setApplyNote(applyNote);
        req.setApplyUser(applyUser);
        req.setModelCode(modelCode);
        req.setQuantity(quantity);
        req.setReceiptTitle(receiptTitle);
        req.setReceiptType(receiptType);
        req.setSalePrice(salePrice);
        return BizConnecter.getBizData("602020", JsonUtils.object2Json(req),
            Object.class);
	}
	public Object payOrder(String code, String userId, String tradePwd){
		if (StringUtils.isBlank(code)) {
            throw new BizException("A010001", "订单编号不能为空");
        }
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        if (StringUtils.isBlank(tradePwd)) {
            throw new BizException("A010001", "交易密码不能为空");
        }
        XN602022Req req = new XN602022Req();
        req.setCode(code);
        req.setTradePwd(tradePwd);
        req.setUserId(userId);
        return BizConnecter.getBizData("602022", JsonUtils.object2Json(req),
                Object.class);
	}
	public Object cancelOrder(String code, String userId, String applyNote){
		if (StringUtils.isBlank(code)) {
            throw new BizException("A010001", "订单编号不能为空");
        }
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        if (StringUtils.isBlank(applyNote)) {
            throw new BizException("A010001", "取消说明不能为空");
        }
        XN602023Req req = new XN602023Req();
        req.setCode(code);
        req.setApplyNote(applyNote);
        req.setUserId(userId);
        return BizConnecter.getBizData("602023", JsonUtils.object2Json(req),
                Object.class);
	}
	public Object queryPageOrders(String applyUser, String status, String limit,
			String orderColumn, String orderDir, String start){
		if (StringUtils.isBlank(applyUser)) {
            throw new BizException("A010001", "下单人编号不能为空");
        }
        if (StringUtils.isBlank(limit)) {
            throw new BizException("A010001", "页面个数不能为空");
        }
        if (StringUtils.isBlank(start)) {
        	throw new BizException("A010001", "第几页不能为空");
        }
        XN602025Req req = new XN602025Req();
        req.setApplyUser(applyUser);
        req.setLimit(limit);
        req.setOrderColumn(orderColumn);
        req.setOrderDir(orderDir);
        req.setStart(start);
        req.setStatus(status);
        return BizConnecter.getBizData("602025", JsonUtils.object2Json(req),
                Object.class);
	}
	public Object queryOrder(String invoiceCode){
		 if (StringUtils.isBlank(invoiceCode)) {
			 throw new BizException("A010001", "订单编号不能为空");
		 }
		 XN602027Req req = new XN602027Req();
		 req.setInvoiceCode(invoiceCode);
		 return BizConnecter.getBizData("602027", JsonUtils.object2Json(req),
				Object.class);
	}
	public Object queryOrders(String applyUser, String status){
		if (StringUtils.isBlank(applyUser)) {
			 throw new BizException("A010001", "下单人编号不能为空");
		}
		XN602026Req req = new XN602026Req();
		req.setApplyUser(applyUser);
		req.setStatus(status);
		return BizConnecter.getBizData("602026", JsonUtils.object2Json(req), 
				Object.class);
	}
}
