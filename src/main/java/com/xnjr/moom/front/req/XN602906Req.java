package com.xnjr.moom.front.req;

/** 
 * 设置商家负责人(预留)
 * @author: zuixian 
 * @since: 2016年9月20日 下午2:12:59 
 * @history:
 */
public class XN602906Req {

    // 商家编号（必填）
    private String toMerchant;

    // 用户ID（必填）
    private String fromUser;

    // 积分数量（必填）
    private String amount;

    // 人民币金额（必填）填0
    private String cnyAmount;

    // 返现积分(选填)
    private String jfCashBack;

    // 返现人民币(选填)
    private String cnyCashBack;

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

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getCnyAmount() {
        return cnyAmount;
    }

    public void setCnyAmount(String cnyAmount) {
        this.cnyAmount = cnyAmount;
    }

    public String getJfCashBack() {
        return jfCashBack;
    }

    public void setJfCashBack(String jfCashBack) {
        this.jfCashBack = jfCashBack;
    }

    public String getCnyCashBack() {
        return cnyCashBack;
    }

    public void setCnyCashBack(String cnyCashBack) {
        this.cnyCashBack = cnyCashBack;
    }
}
