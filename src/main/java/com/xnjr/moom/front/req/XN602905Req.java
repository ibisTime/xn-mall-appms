package com.xnjr.moom.front.req;

public class XN602905Req {
    // 商家编号（必填）
    private String toMerchant;

    // （选填） 用户Id
    private String fromUser;

    public String getToMerchant() {
        return toMerchant;
    }

    public void setToMerchant(String toMerchant) {
        this.toMerchant = toMerchant;
    }

    public String getFromUser() {
        return fromUser;
    }

    public void setFromUser(String fromUser) {
        this.fromUser = fromUser;
    }
}
