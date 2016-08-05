package com.xnjr.moom.front.req;

public class XN601043Req {
    // 型号编号
    private String modelCode;

    // 等级
    private String toLevel;

    // 线上位置
    private String toSite;

    // 状态 1 上架； 0 下架
    private String status;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getModelCode() {
        return modelCode;
    }

    public void setModelCode(String modelCode) {
        this.modelCode = modelCode;
    }

    public String getToLevel() {
        return toLevel;
    }

    public void setToLevel(String toLevel) {
        this.toLevel = toLevel;
    }

    public String getToSite() {
        return toSite;
    }

    public void setToSite(String toSite) {
        this.toSite = toSite;
    }
}
