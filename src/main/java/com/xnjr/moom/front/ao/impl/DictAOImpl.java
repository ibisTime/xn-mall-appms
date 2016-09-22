package com.xnjr.moom.front.ao.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.IDictAO;
import com.xnjr.moom.front.exception.BizException;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XNlh5014Req;
import com.xnjr.moom.front.req.XNlh5034Req;
import com.xnjr.moom.front.res.XNlh5034Res;

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

    public XNlh5034Res queryDictByKey(String userId, String key) {
        if (StringUtils.isBlank(userId)) {
            throw new BizException("A010001", "用户编号不能为空");
        }
        if (StringUtils.isBlank(key)) {
            throw new BizException("A010001", "key不能为空");
        }
        XNlh5034Req req = new XNlh5034Req();
        req.setKey(key);
        return BizConnecter.getBizData("lh5034", JsonUtils.object2Json(req),
            XNlh5034Res.class);
    }

}
