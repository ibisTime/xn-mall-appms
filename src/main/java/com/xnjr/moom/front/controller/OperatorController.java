package com.xnjr.moom.front.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnjr.moom.front.ao.IOperatorAO;


@Controller
@RequestMapping(value = "")
public class OperatorController extends BaseController {
	
	@Autowired
	IOperatorAO operatorAO;
	
	@RequestMapping(value = "/operators", method = RequestMethod.GET)
    @ResponseBody
    public Object getOperator(@RequestParam("id") String id) {
        return operatorAO.getOperator(id);
    }
}
