package com.xnjr.moom.front.ao.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.ICommodityAO;
import com.xnjr.moom.front.exception.BizException;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XN601005Req;
import com.xnjr.moom.front.req.XN601006Req;
import com.xnjr.moom.front.req.XN601025Req;
import com.xnjr.moom.front.req.XN601026Req;

@Service
public class CommodityAOImpl implements ICommodityAO {

	@Override
	public Object queryProduces(String type, String name, String updater, String status) {
		if(StringUtils.isBlank(type)){
			type = "";
		}
		if(StringUtils.isBlank(name)){
			name = "";
		}
		if(StringUtils.isBlank(updater)){
			updater = "";
		}
		status = "3";
		XN601005Req req = new XN601005Req();
		req.setName(name);
		req.setStatus(status);
		req.setType(type);
		req.setUpdater(updater);
        return BizConnecter.getBizData("601005", JsonUtils.object2Json(req),
        		Object.class);
	}

	public Object queryProduce(String code){
		if(StringUtils.isBlank(code)){
			code = "";
		}
		XN601006Req req = new XN601006Req();
		req.setCode(code);
		return BizConnecter.getBizData("601006", JsonUtils.object2Json(req),
        		Object.class);
	}
	
	public Object queryListModel(String code, String name, String status, String productCode){
		if(StringUtils.isBlank(code)){
			code = "";
		}
		if(StringUtils.isBlank(name)){
			name = "";
		}
		if(StringUtils.isBlank(productCode)){
			productCode = "";
		}
		status = "";
		XN601025Req xn601025Req = new XN601025Req();
		xn601025Req.setCode(code);
		xn601025Req.setName(name);
		xn601025Req.setProductCode(productCode);
		xn601025Req.setStatus(status);
		return BizConnecter.getBizData("601025", JsonUtils.object2Json(xn601025Req),
        		Object.class);
	}
	public Object queryModel(String code){
		if(StringUtils.isBlank(code)){
			throw new BizException("A010001", "型号编号不能为空");
		}
		XN601026Req xn601026Req = new XN601026Req();
		xn601026Req.setCode(code);
		return BizConnecter.getBizData("601026", JsonUtils.object2Json(xn601026Req),
        		Object.class);
	}
}
