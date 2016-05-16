package com.xnjr.moom.front.ao;

import java.util.List;

import com.xnjr.moom.front.res.Page;
import com.xnjr.moom.front.res.XN803900Res;

/** 
 * @author: miyb 
 * @since: 2015-5-12 下午3:51:05 
 * @history:
 */
public interface IAccountAO {

    /**
     * 根据userId查询账户资金
     * @param userId
     * @return 
     * @create: 2015年8月31日 下午8:32:43 myb858
     * @history:
     */
    Object getAccountByUserId(String userId);

    /**
     * 查询资金明细
     * @param userId
     * @param ajNo
     * @param bizType
     * @param dateStart
     * @param dateEnd
     * @param orderColumn
     * @param orderDir
     * @param start
     * @param limit
     * @return 
     * @create: 2015-5-17 上午10:35:55 xieyj
     * @history:
     */
    Page queryAccountDetail(String userId, String bizType, String dateStart,
            String dateEnd, String start, String limit, String orderColumn,
            String orderDir);

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

}
