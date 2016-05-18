package com.xnjr.moom.front.ao.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.ICommodityAO;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XN601005Req;
import com.xnjr.moom.front.req.XN601006Req;

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
		if(StringUtils.isBlank(status)){
			status = "";
		}
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
}
