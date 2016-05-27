package com.xnjr.moom.front.ao;

public interface IOperatorAO {

	/**
	 * 选择一个型号，提交订单
	 * @param applyUser
	 * @param modelCode
	 * @param quantity
	 * @param salePrice
	 * @param addressCode
	 * @param applyNote
	 * @param receiptType
	 * @param receiptTitle
	 * @return
	 */
	public Object submitOrder(String applyUser, String modelCode, String quantity, 
			String salePrice, String addressCode, String applyNote,
			String receiptType, String receiptTitle);
	/**
	 * 支付订单
	 * @param code
	 * @param userId
	 * @param tradePwd
	 * @return
	 */
	public Object payOrder(String code, String userId, String tradePwd);
	
	/**
	 * 取消订单
	 * @param code
	 * @param userId
	 * @param applyNote
	 * @return
	 */
	public Object cancelOrder(String code, String userId, String applyNote);
	
	/**
	 * 订单分页查询
	 * @param applyUser
	 * @param status
	 * @param limit
	 * @param orderColumn
	 * @param orderDir
	 * @param start
	 * @return
	 */
	public Object queryPageOrders(String applyUser, String status, String limit,
			String orderColumn, String orderDir, String start);
	
	/**
	 * 订单详情查询
	 * @param invoiceCode
	 * @return
	 */
	public Object queryOrder(String invoiceCode);
	
	/**
	 * 订单列表查询
	 * @param applyUser
	 * @param status
	 * @return
	 */
	public Object queryOrders(String applyUser, String status);
}
