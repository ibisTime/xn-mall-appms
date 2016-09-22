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
public class XN802315Req {
    // 购买用户编号(必填)
    private String userId;

    // 积分数量(必填)
    private String amount;

    // 人民币数量(必填) 可传0
    private String cnyAmount;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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

}
