package com.xnjr.moom.front.ao.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.xnjr.moom.front.ao.ICommodityAO;
import com.xnjr.moom.front.exception.BizException;
import com.xnjr.moom.front.http.BizConnecter;
import com.xnjr.moom.front.http.JsonUtils;
import com.xnjr.moom.front.req.XN601004Req;
import com.xnjr.moom.front.req.XN601005Req;
import com.xnjr.moom.front.req.XN601006Req;
import com.xnjr.moom.front.req.XN601007Req;
import com.xnjr.moom.front.req.XN601026Req;
import com.xnjr.moom.front.req.XN601042Req;
import com.xnjr.moom.front.req.XN601043Req;

@Service
public class CommodityAOImpl implements ICommodityAO {

    @Override
    public Object queryProduces(String type, String name, String updater,
            String status) {
        if (StringUtils.isBlank(type)) {
            type = "";
        }
        if (StringUtils.isBlank(name)) {
            name = "";
        }
        if (StringUtils.isBlank(updater)) {
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

    public Object queryProduce(String code) {
        if (StringUtils.isBlank(code)) {
            code = "";
        }
        XN601006Req req = new XN601006Req();
        req.setCode(code);
        return BizConnecter.getBizData("601006", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object queryListModel(String modelCode, String toSite) {
        String status = "1";
        XN601043Req req = new XN601043Req();
        String toLevel = "0";
        req.setModelCode(modelCode);
        req.setStatus(status);
        req.setToLevel(toLevel);
        req.setToSite(toSite);
        return BizConnecter.getBizData("601043", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object queryModel(String code) {
        if (StringUtils.isBlank(code)) {
            throw new BizException("A010001", "型号编号不能为空");
        }
        XN601026Req xn601026Req = new XN601026Req();
        xn601026Req.setCode(code);
        return BizConnecter.getBizData("601026",
            JsonUtils.object2Json(xn601026Req), Object.class);
    }

    public Object queryPageModel(String modelCode, String toSite, String start,
            String limit, String orderColumn, String orderDir, String category,
            String type, String productCode, String modelName) {
        if (StringUtils.isBlank(start)) {
            throw new BizException("A010001", "开始页不能为空");
        }
        if (StringUtils.isBlank(limit)) {
            throw new BizException("A010001", "每页个数不能为空");
        }
        String status = "1";
        String toLevel = "0";
        XN601042Req req = new XN601042Req();
        req.setCategory(category);
        req.setProductCode(productCode);
        req.setType(type);
        req.setStatus(status);
        req.setLimit(limit);
        req.setOrderDir(orderDir);
        req.setOrderColumn(orderColumn);
        req.setStart(start);
        req.setToLevel(toLevel);
        req.setToSite(toSite);
        req.setModelCode(modelCode);
        req.setModelName(modelName);
        return BizConnecter.getBizData("601042", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object getProductPage(String category, String type, String name,
            String status, String updater, String start, String limit,
            String orderColumn, String orderDir) {
        if (StringUtils.isBlank(start)) {
            throw new BizException("A010001", "开始页不能为空");
        }
        if (StringUtils.isBlank(limit)) {
            throw new BizException("A010001", "每页个数不能为空");
        }
        XN601004Req req = new XN601004Req();
        req.setCategory(category);
        req.setLimit(limit);
        req.setName(name);
        req.setOrderColumn(orderColumn);
        req.setOrderDir(orderDir);
        req.setStart(start);
        req.setStatus(status);
        req.setType(type);
        req.setUpdater(updater);
        return BizConnecter.getBizData("601004", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object getProductList(String category, String type, String name,
            String status, String updater) {
        XN601005Req req = new XN601005Req();
        req.setCategory(category);
        req.setName(name);
        req.setStatus("1");
        req.setType(type);
        req.setUpdater(updater);
        return BizConnecter.getBizData("601005", JsonUtils.object2Json(req),
            Object.class);
    }

    public Object querySubdivisionList(String category) {
        if (StringUtils.isBlank(category)) {
            throw new BizException("A010001", "大类不能为空");
        }
        XN601007Req req = new XN601007Req();
        req.setCategory(category);
        return BizConnecter.getBizData("601007", JsonUtils.object2Json(req),
            Object.class);
    }

}
