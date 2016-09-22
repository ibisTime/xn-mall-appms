/**
 * @Title XN802314Req.java 
 * @Package com.std.account.dto.req 
 * @Description 
 * @author xieyj  
 * @date 2016年9月22日 下午8:06:33 
 * @version V1.0   
 */
package com.xnjr.moom.front.req;

/** 
 * @author: xieyj 
 * @since: 2016年9月22日 下午8:06:33 
 * @history:
 */
public class XN802314Req {
    // 来方用户编号(必填)
    private String fromUserId;

    // 去方用户编号(必填)
    private String toUserId;

    // 积分数量(必填)
    private String amount;

    // 人民币数量(必填) 可传0
    private String cnyAmount;

    // 返现积分(选填)
    private String jfCashBack;

    // 返现人民币(选填)
    private String cnyCashBack;

    public String getFromUserId() {
        return fromUserId;
    }

    public void setFromUserId(String fromUserId) {
        this.fromUserId = fromUserId;
    }

    public String getToUserId() {
        return toUserId;
    }

    public void setToUserId(String toUserId) {
        this.toUserId = toUserId;
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
