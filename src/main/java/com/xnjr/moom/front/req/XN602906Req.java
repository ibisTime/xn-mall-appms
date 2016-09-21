package com.xnjr.moom.front.req;

public class XN602906Req {
    // 商家编号
    private String toMerchant;

    // 用户ID
    private String fromUser;

    // 积分数量
    private String quantity;

    // 人民币金额
    private String amount;

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

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }
}
