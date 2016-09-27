package com.xnjr.moom.front.ao;

public interface ICommodityAO {
    /**
     * 列表查询产品
     * @param type
     * @param name
     * @param updater
     * @param status
     * @return
     */
    public Object queryProduces(String type, String name, String updater,
            String status);

    /**
     * 详情查询产品
     * @param code
     * @return
     */
    public Object queryProduce(String code);

    /**
     * 查询列表型号
     * @param modelCode
     * @param toSite
     * @return
     */
    public Object queryListModel(String modelCode, String toSite);

    /**
     * 详情查询型号
     * @param code
     * @return
     */
    public Object queryModel(String code);

    /**
     * 分页查询型号
     * @param modelCode
     * @param toSite
     * @param start
     * @param limit
     * @param orderColumn
     * @param orderDir
     * @param modelName
     * @return 
     * @history:
     */
    public Object queryPageModel(String modelCode, String toSite, String start,
            String limit, String orderColumn, String orderDir, String category,
            String type, String productCode, String modelName);

    /**
     * 分页查询产品类型
     * @param category
     * @param type
     * @param name
     * @param status
     * @param updater
     * @param start
     * @param limit
     * @param orderColumn
     * @param orderDir
     * @return 
     * @history:
     */
    public Object getProductPage(String category, String type, String name,
            String status, String updater, String start, String limit,
            String orderColumn, String orderDir);

    /**
     * 列表查询产品类型
     * @param category
     * @param type
     * @param name
     * @param status
     * @param updater
     * @return 
     * @history:
     */
    public Object getProductList(String category, String type, String name,
            String status, String updater);

    /**
     * 根据大类查询所有启用产品的小类
     * @param category
     * @return 
     * @history:
     */
    public Object querySubdivisionList(String category);

    /**
     * 分页查询商家信息
     * @param loginName
     * @param name
     * @param type
     * @param province
     * @param city
     * @param area
     * @param status
     * @param priority
     * @param updater
     * @param start
     * @param limit
     * @return 
     * @create: 2016年9月21日 下午2:31:17 wulq
     * @history:
     */
    public Object businessPage(String loginName, String name, String type,
            String province, String city, String area, String status,
            String priority, String updater, String start, String limit,
            String orderDir, String orderColumn);

    /**
     * 列表查询商家信息
     * @param name
     * @param type
     * @param province
     * @param city
     * @param area
     * @param status
     * @param priority
     * @param updater
     * @return 
     * @create: 2016年9月21日 下午3:03:38 wulq
     * @history:
     */
    public Object businessList(String loginName, String name, String type,
            String province, String city, String area, String status,
            String priority, String updater);

    /**
     * 详情查询商家信息
     * @param code
     * @return 
     * @create: 2016年9月21日 下午3:09:42 wulq
     * @history:
     */
    public Object business(String code);
}
