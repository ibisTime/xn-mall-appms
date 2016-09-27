package com.xnjr.moom.front.ao;

import java.util.List;

import com.xnjr.moom.front.res.Page;

/** 
 * @author: miyb 
 * @since: 2015-5-12 下午3:51:05 
 * @history:
 */
public interface IAccountAO {

    /**
     * 根据userId和currency(币种)查询账户资金
     * @param userId
     * @param currency
     * @return 
     * @create: 2015年8月31日 下午8:32:43 myb858
     * @history:
     */
    Object getAccountByUserId(String userId, String currency);

    /**
     * 查询资金明细
     * @param userId
     * @param accountNumber
     * @param ajNo
     * @param start
     * @param limit
     * @param bizType
     * @param dateStart
     * @param dateEnd
     * @return 
     * @history:
     */
    Object queryAccountDetail(String userId, String accountNumber, String ajNo,
            String start, String limit, String bizType, String dateStart,
            String dateEnd);

    /**
     * 分页查询账户列表
     * @param userId
     * @param accountNumber
     * @param status
     * @param realName
     * @param dateStart
     * @param dateEnd
     * @param start
     * @param limit
     * @return 
     * @history:
     */
    Page getAccountPageInfos(String userId, String accountNumber,
            String status, String realName, String dateStart, String dateEnd,
            String start, String limit);

    /*
     * 查询冻结明细
     */
    Page queryFrozenDetail(String accountNumber, String bizType,
            String dateStart, String dateEnd, String start, String limit,
            String orderColumn, String orderDir);

    /*
     * 查询充值取现
     */
    Page queryRechargeAndWithdraw(String accountNumber, String status,
            String dateStart, String dateEnd, String start, String limit,
            String orderColumn, String orderDir);

    /**
     * 获取银行列表
     * @param channelNo
     * @param isEnable
     * @return 
     * @create: 2015年7月2日 下午2:27:10 myb858
     * @history:
     */
    List queryBankList(String channelNo, String isEnable);

    // 获取用户累计本金和累计收益
    Object getSumPP(String userId);

    /**
     * 线下取现
     * @param accountNumber
     * @param amount
     * @param toType
     * @param toCode
     * @return 
     * @history:
     */
    public Object withdraw(String accountNumber, String amount, String toType,
            String toCode, String toBelong);

    /**
     * 线下充值
     * @param userId
     * @param accountNumber
     * @param amount
     * @param fromType
     * @param fromCode
     * @return 
     * @history:
     */
    public Object recharge(String userId, String accountNumber, String amount,
            String fromType, String fromCode);

    /**
     * 返现积分
     * @param fromUser
     * @param toMerchant
     * @param amount
     * @param cnyAmount
     * @param jfCashBack
     * @param cnyCashBack
     * @return 
     * @create: 2016年9月23日 下午1:58:46 wulq
     * @history:
     */
    public Object fxIntegral(String fromUser, String toMerchant, String amount,
            String cnyAmount, String jfCashBack, String cnyCashBack);

    /**
     * 购买积分
     * @param userId
     * @param amount
     * @param cnyAmount
     * @return 
     * @create: 2016年9月22日 下午8:31:27 wulq
     * @history:
     */
    public Object buyIntegral(String userId, String amount, String cnyAmount);

    /**
     * 积分消费
     * @param fromUser
     * @param toMerchant
     * @param amount
     * @param cnyAmount
     * @param jfCashBack
     * @param cnyCashBack
     * @return 
     * @create: 2016年9月23日 下午3:19:28 wulq
     * @history:
     */
    public Object integralConsume(String fromUser, String toMerchant,
            String amount, String cnyAmount, String jfCashBack,
            String cnyCashBack);
}
