package com.pinyougou.sellergoods.service.impl;

import java.util.List;

import com.pinyougou.pojo.TbTypeTemplateExample;
import org.springframework.beans.factory.annotation.Autowired;
import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.mapper.TbItemCatMapper;
import com.pinyougou.pojo.TbItemCat;
import com.pinyougou.pojo.TbItemCatExample;
import com.pinyougou.pojo.TbItemCatExample.Criteria;
import com.pinyougou.sellergoods.service.ItemCatService;

import entity.PageResult;
import org.springframework.data.redis.core.RedisTemplate;

/**
 * 服务实现层
 *
 * @author Administrator
 */
@Service
public class ItemCatServiceImpl implements ItemCatService {

    @Autowired
    private TbItemCatMapper itemCatMapper;

    @Autowired
    private RedisTemplate redisTemplate;

    /**
     * 查询全部
     */
    @Override
    public List<TbItemCat> findAll() {
        return itemCatMapper.selectByExample(null);
    }

    /**
     * 按分页查询
     */
    @Override
    public PageResult findPage(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        Page<TbItemCat> page = (Page<TbItemCat>) itemCatMapper.selectByExample(null);
        return new PageResult(page.getTotal(), page.getResult());
    }

    /**
     * 增加
     */
    @Override
    public void add(TbItemCat itemCat) {
        itemCatMapper.insert(itemCat);
    }


    /**
     * 修改
     */
    @Override
    public void update(TbItemCat itemCat) {
        itemCatMapper.updateByPrimaryKey(itemCat);
    }

    /**
     * 根据ID获取实体
     *
     * @param id
     * @return
     */
    @Override
    public TbItemCat findOne(Long id) {
        return itemCatMapper.selectByPrimaryKey(id);
    }

    /**
     * 批量删除
     */
    @Override
    public void delete(Long[] ids) {


        for (Long id : ids) {

            //查询其子分类
            TbItemCatExample example1 = new TbItemCatExample();
            Criteria criteria1 = example1.createCriteria();
            criteria1.andParentIdEqualTo(id);
            List<TbItemCat> itemCats = itemCatMapper.selectByExample(example1);
            if (itemCats != null && itemCats.size() != 0) {
                throw new RuntimeException();
            }

            itemCatMapper.deleteByPrimaryKey(id);

            //删除子分类
            //dele(id);
        }
    }

    /**
     * 按id删除分类及其子分类
     * @param id
     */
    private void dele(Long id) {
        //按id删除
        itemCatMapper.deleteByPrimaryKey(id);
        //查询其子分类
        TbItemCatExample example1 = new TbItemCatExample();
        Criteria criteria1 = example1.createCriteria();
        criteria1.andParentIdEqualTo(id);
        List<TbItemCat> itemCats = itemCatMapper.selectByExample(example1);
        if (itemCats == null || itemCats.size() == 0) {
            return;
        }
        //删除子分类
        for (TbItemCat itemCat : itemCats) {
            itemCatMapper.deleteByPrimaryKey(itemCat.getId());
            dele(itemCat.getId());
        }
    }

    @Override
    public PageResult findPage(TbItemCat itemCat, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);

        TbItemCatExample example = new TbItemCatExample();
        Criteria criteria = example.createCriteria();

        if (itemCat != null) {
            if (itemCat.getName() != null && itemCat.getName().length() > 0) {
                criteria.andNameLike("%" + itemCat.getName() + "%");
            }

        }

        Page<TbItemCat> page = (Page<TbItemCat>) itemCatMapper.selectByExample(example);
        return new PageResult(page.getTotal(), page.getResult());
    }

    @Override
    public List<TbItemCat> findByParentId(Long parentId) {
        TbItemCatExample example = new TbItemCatExample();
        Criteria criteria = example.createCriteria();
        criteria.andParentIdEqualTo(parentId);

        //缓存商品分类表
        //每次执行查询的时候，一次性读取缓存进行存储（因为每次增删改都有执行此方法）
        List<TbItemCat> list = findAll();
        for (TbItemCat itemCat : list) {
            redisTemplate.boundHashOps("itemCat").put(itemCat.getName(), itemCat.getTypeId());
        }
        System.out.println("更新缓存：商品分类表");
        return itemCatMapper.selectByExample(example);
    }

}
