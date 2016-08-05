package com.xnjr.moom.front.ao.impl;

import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.IDictAO;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XNlh5014Req;

@Service
public class DictAOImpl implements IDictAO {

    public Object queryDictList(String type, String parentKey, String dkey,
            String orderColumn, String orderDir) {
        XNlh5014Req req = new XNlh5014Req();
        req.setType(type);
        req.setParentKey(parentKey);
        req.setDkey(dkey);
        req.setOrderColumn(orderColumn);
        req.setOrderDir(orderDir);
        return BizConnecter.getBizData("lh5014", JsonUtils.object2Json(req),
            Object.class);
    }

}
