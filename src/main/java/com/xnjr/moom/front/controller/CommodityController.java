package com.xnjr.moom.front.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnjr.moom.front.ao.ICommodityAO;

@Controller
@RequestMapping(value = "/commodity")
public class CommodityController extends BaseController {
    @Autowired
    ICommodityAO commodityAO;

    // 列表查询产品
    @RequestMapping(value = "/queryProduces", method = RequestMethod.GET)
    @ResponseBody
    public Object queryProduces(
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "updater", required = false) String updater,
            @RequestParam(value = "status", required = false) String status) {
        return commodityAO.queryProduces(type, name, updater, status);
    }

    // 详情查询产品
    @RequestMapping(value = "/queryProduce", method = RequestMethod.GET)
    @ResponseBody
    public Object queryProduce(
            @RequestParam(value = "code", required = false) String code) {

        return commodityAO.queryProduce(code);
    }

    // 查询列表型号
    @RequestMapping(value = "/queryListModel", method = RequestMethod.GET)
    @ResponseBody
    public Object queryListModel(
            @RequestParam(value = "modelCode", required = false) String modelCode,
            @RequestParam(value = "toSite", required = false) String toSite) {
        return commodityAO.queryListModel(modelCode, toSite);
    }

    // 分页查询型号
    @RequestMapping(value = "/queryPageModel", method = RequestMethod.GET)
    @ResponseBody
    public Object queryPageModel(
            @RequestParam(value = "modelCode", required = false) String modelCode,
            @RequestParam(value = "toSite", required = false) String toSite,
            @RequestParam("start") String start,
            @RequestParam("limit") String limit,
            @RequestParam(value = "orderColumn", required = false) String orderColumn,
            @RequestParam(value = "orderDir", required = false) String orderDir,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "productCode", required = false) String productCode,
            @RequestParam(value = "modelName", required = false) String modelName) {
        return commodityAO.queryPageModel(modelCode, toSite, start, limit,
            orderColumn, orderDir, category, type, productCode, modelName);
    }

    // 详情查询型号
    @RequestMapping(value = "/queryModel", method = RequestMethod.GET)
    @ResponseBody
    public Object queryModel(@RequestParam("code") String code) {
        return commodityAO.queryModel(code);
    }

    // 分页查询产品类型
    @RequestMapping(value = "/product/page", method = RequestMethod.GET)
    @ResponseBody
    public Object getProductPage(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "updater", required = false) String updater,
            @RequestParam("start") String start,
            @RequestParam("limit") String limit,
            @RequestParam(value = "orderColumn", required = false) String orderColumn,
            @RequestParam(value = "orderDir", required = false) String orderDir) {
        return commodityAO.getProductPage(category, type, name, status,
            updater, start, limit, orderColumn, orderDir);
    }

    // 列表查询产品类型
    @RequestMapping(value = "/product/list", method = RequestMethod.GET)
    @ResponseBody
    public Object getProductList(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "updater", required = false) String updater) {
        return commodityAO
            .getProductList(category, type, name, status, updater);
    }

    // 根据大类查询所有启用产品的小类
    @RequestMapping(value = "/subdivision/list", method = RequestMethod.GET)
    @ResponseBody
    public Object querySubdivisionList(@RequestParam("category") String category) {
        return commodityAO.querySubdivisionList(category);
    }

    // 分页查询商家信息
    @RequestMapping(value = "/business/page", method = RequestMethod.POST)
    @ResponseBody
    public Object businessPage(
            @RequestParam(value = "loginName", required = false) String loginName,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "province", required = false) String province,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "area", required = false) String area,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "priority", required = false) String priority,
            @RequestParam(value = "updater", required = false) String updater,
            @RequestParam("limit") String limit,
            @RequestParam("start") String start,
            @RequestParam(value = "orderDir", required = false) String orderDir,
            @RequestParam(value = "orderColumn", required = false) String orderColumn) {
        return commodityAO.businessPage(loginName, name, type, province, city,
            area, status, priority, updater, start, limit, orderDir,
            orderColumn);
    }

    // 列表查询商家信息
    @RequestMapping(value = "/business/list", method = RequestMethod.POST)
    @ResponseBody
    public Object businessList(
            @RequestParam(value = "loginName", required = false) String loginName,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "province", required = false) String province,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "area", required = false) String area,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "priority", required = false) String priority,
            @RequestParam(value = "updater", required = false) String updater) {
        return commodityAO.businessList(loginName, name, type, province, city,
            area, status, priority, updater);
    }

    // 详情查询商家信息
    @RequestMapping(value = "/business", method = RequestMethod.POST)
    @ResponseBody
    public Object business(@RequestParam("code") String code) {
        return commodityAO.business(code);
    }
}
