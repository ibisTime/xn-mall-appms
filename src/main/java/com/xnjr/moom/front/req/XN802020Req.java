package com.xnjr.moom.front.req;

public class XN802020Req {
    // 账户编号
    private String userId;

    // 账号
    private String accountNumber;

    // 明细编号
    private String ajNo;

    // 状态
    private String status;

    // 业务类型 10=虚拟币兑换, 11=充值, -11=取现, 12=转入, -12=转出, 19=蓝补, -19=红冲
    private String bizType;

    // 关联号
    private String refNo;

    // 对账日
    private String workDate;

    // 对账人
    private String checkUser;

    // 起始时间
    private String dateStart;

    // 终止时间
    private String dateEnd;

    // 第几页
    private String start;

    // 页面个数
    private String limit;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getAjNo() {
        return ajNo;
    }

    public void setAjNo(String ajNo) {
        this.ajNo = ajNo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getBizType() {
        return bizType;
    }

    public void setBizType(String bizType) {
        this.bizType = bizType;
    }

    public String getRefNo() {
        return refNo;
    }

    public void setRefNo(String refNo) {
        this.refNo = refNo;
    }

    public String getWorkDate() {
        return workDate;
    }

    public void setWorkDate(String workDate) {
        this.workDate = workDate;
    }

    public String getCheckUser() {
        return checkUser;
    }

    public void setCheckUser(String checkUser) {
        this.checkUser = checkUser;
    }

    public String getDateStart() {
        return dateStart;
    }

    public void setDateStart(String dateStart) {
        this.dateStart = dateStart;
    }

    public String getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(String dateEnd) {
        this.dateEnd = dateEnd;
    }

    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getLimit() {
        return limit;
    }

    public void setLimit(String limit) {
        this.limit = limit;
    }
}
