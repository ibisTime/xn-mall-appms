package com.xnjr.moom.front.ao;

public interface ICommodityAO {
	public Object queryProduces(String type, String name, String updater, String status);
	public Object queryProduce(String code);
}
