package com.xnjr.moom.front.ao;

public interface IDictAO {
    public Object queryDictList(String type, String parentKey, String dkey,
            String orderColumn, String orderDir);
}
