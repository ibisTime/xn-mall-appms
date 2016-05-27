package com.xnjr.moom.front.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnjr.moom.front.ao.IOperatorAO;


@Controller
@RequestMapping(value = "operators")
public class OperatorController extends BaseController {
	
	@Autowired
	IOperatorAO operatorAO;
	
	@RequestMapping(value = "/submitOrder", method = RequestMethod.POST)
    @ResponseBody
    public Object submitOrder(
    		@RequestParam(value = "applyUser", required = false) String applyUser,
    		@RequestParam("modelCode") String modelCode,
    		@RequestParam("quantity") String quantity,
    		@RequestParam("salePrice") String salePrice,
    		@RequestParam("addressCode") String addressCode,
    		@RequestParam(value = "applyNote", required = false) String applyNote,
    		@RequestParam(value = "receiptType", required = false) String receiptType,
    		@RequestParam(value = "receiptTitle", required = false) String receiptTitle) {
        return operatorAO.submitOrder(getSessionUserId(applyUser), modelCode, quantity,
        		salePrice, addressCode, applyNote, receiptType, receiptTitle);
    }
	
	@RequestMapping(value = "/payOrder", method = RequestMethod.POST)
    @ResponseBody
    public Object payOrder(
    		@RequestParam("code") String code,
    		@RequestParam(value = "userId", required = false) String userId,
    		@RequestParam("tradePwd") String tradePwd){
		return operatorAO.payOrder(code, getSessionUserId(userId), tradePwd);
	}
	
	@RequestMapping(value = "/cancelOrder", method = RequestMethod.POST)
    @ResponseBody
    public Object cancelOrder(
    		@RequestParam("code") String code,
    		@RequestParam(value = "userId", required = false) String userId,
    		@RequestParam("applyNote") String applyNote){
		return operatorAO.cancelOrder(code, getSessionUserId(userId), applyNote);
	}
	
	@RequestMapping(value = "/queryPageOrders", method = RequestMethod.POST)
    @ResponseBody
	public Object queryPageOrders(
			@RequestParam(value = "applyUser", required = false) String applyUser,
    		@RequestParam(value = "status", required = false) String status,
    		@RequestParam("limit") String limit,
    		@RequestParam(value = "orderColumn", required = false) String orderColumn,
    		@RequestParam(value = "orderDir", required = false) String orderDir,
    		@RequestParam("start") String start){
		return operatorAO.queryPageOrders(getSessionUserId(applyUser), status, limit, orderColumn, orderDir, start);
	}
	
	@RequestMapping(value = "/queryOrder", method = RequestMethod.POST)
    @ResponseBody
	public Object queryOrder(@RequestParam("invoiceCode") String invoiceCode){
		return operatorAO.queryOrder(invoiceCode);
	}
	
	@RequestMapping(value = "/queryOrders", method = RequestMethod.POST)
    @ResponseBody
	public Object queryOrders(
			@RequestParam(value= "applyUser", required = false)	String applyUser,
			@RequestParam(value= "status", required = false) String status){
		return operatorAO.queryOrders(getSessionUserId(applyUser), status);
	}
}
