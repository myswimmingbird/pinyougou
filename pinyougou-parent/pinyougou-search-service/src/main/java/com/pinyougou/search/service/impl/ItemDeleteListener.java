package com.pinyougou.search.service.impl;

import com.pinyougou.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.ObjectMessage;
import java.io.Serializable;
import java.util.Arrays;

@Component
public class ItemDeleteListener implements MessageListener {

    @Autowired
    private ItemSearchService itemSearchService;

    @Override
    public void onMessage(Message message) {
        try {
            ObjectMessage objectMessage = (ObjectMessage) message;
            Long[] goodsId = (Long[]) objectMessage.getObject();
            System.out.println("ItemDeleteListener监听接收到消息...");
            itemSearchService.deleteByGoodsIds(Arrays.asList(goodsId));
            System.out.println("成功删除索引数据库中的记录");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
