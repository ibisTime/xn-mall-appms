package com.xnjr.moom.front.ao;

import java.util.List;

import com.xnjr.moom.front.res.XN707000Res;
import com.xnjr.moom.front.res.XNlh5014Res;

public interface IGeneralAO {
    public List queryBanks(String status, String orderColumn, String orderDir);
}
