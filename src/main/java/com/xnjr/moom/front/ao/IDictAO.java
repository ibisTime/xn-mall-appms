package com.xnjr.moom.front.ao;

import com.xnjr.moom.front.res.XNlh5034Res;

public interface IDictAO {
    public Object queryDictList(String type, String parentKey, String dkey,
            String orderColumn, String orderDir);

    public XNlh5034Res queryDictByKey(String userId, String key);
}
