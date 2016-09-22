package com.xnjr.moom.front.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnjr.moom.front.ao.IDictAO;
import com.xnjr.moom.front.res.XNlh5034Res;

@Controller
@RequestMapping(value = "/general/dict")
public class DictController extends BaseController {
    @Autowired
    IDictAO dictAO;

    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @ResponseBody
    public Object queryDictList(
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "orderColumn", required = false) String orderColumn,
            @RequestParam(value = "orderDir", required = false) String orderDir,
            @RequestParam(value = "dkey", required = false) String dkey,
            @RequestParam(value = "parentKey", required = false) String parentKey) {
        return dictAO.queryDictList(type, parentKey, dkey, orderColumn,
            orderDir);
    }

    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/key", method = RequestMethod.GET)
    @ResponseBody
    public XNlh5034Res queryDictByKey(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("key") String key) {
        return dictAO.queryDictByKey(getSessionUserId(userId), key);
    }
}
