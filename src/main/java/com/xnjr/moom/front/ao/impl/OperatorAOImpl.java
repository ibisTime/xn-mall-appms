package com.xnjr.moom.front.ao.impl;

import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.IOperatorAO;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;

@Service
public class OperatorAOImpl implements IOperatorAO {

    @Override
    public Object getOperator(String id) {
        return BizConnecter.getBizData("gs0008", JsonUtils.string2Json("userId", id),
        		Object.class);
    }

}
