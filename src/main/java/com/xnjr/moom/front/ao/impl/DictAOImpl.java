package com.xnjr.moom.front.ao.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.IDictAO;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.StatusReq;
import com.xnjr.moom.front.req.XNlh5014Req;
import com.xnjr.moom.front.res.XNlh5014Res;

@Service
public class DictAOImpl implements IDictAO {

    @Override
    public List<XNlh5014Res> queryDictList(String type) {
        return BizConnecter.getBizData("lh5014",
            JsonUtils.string2Json("parentKey", type), List.class);
    }

    @Override
    public List queryBanks(String status, String orderColumn, String orderDir) {
        StatusReq req = new StatusReq();
        req.setStatus(status);
        req.setOrderColumn(orderColumn);
        req.setOrderDir(orderDir);
        return BizConnecter.getBizData("bk2004", JsonUtils.object2Json(req),
            List.class);
    }

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
