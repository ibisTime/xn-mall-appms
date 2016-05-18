package com.xnjr.moom.front.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnjr.moom.front.ao.ICommodityAO;

@Controller
@RequestMapping(value = "/commodity")
public class CommodityController extends BaseController {
	@Autowired
	ICommodityAO commodityAO;
	
    @RequestMapping(value = "/queryProduces", method = RequestMethod.GET)
    @ResponseBody
	public Object queryProduces(@RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "updater", required = false) String updater,
            @RequestParam(value = "status", required = false) String status){
    	return commodityAO.queryProduces(type, name, updater, status);
	}
    
    @RequestMapping(value = "/queryProduce", method = RequestMethod.GET)
    @ResponseBody
	public Object queryProduce( 
			@RequestParam(value = "code", required = false) String code){
    	
    	return commodityAO.queryProduce(code);
	}
}
