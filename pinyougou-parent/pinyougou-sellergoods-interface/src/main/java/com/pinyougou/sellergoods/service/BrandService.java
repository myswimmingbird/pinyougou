package com.pinyougou.sellergoods.service;

import entity.PageResult;
import com.pinyougou.pojo.TbBrand;

import java.util.List;
import java.util.Map;

public interface BrandService {

    List<TbBrand> findAll();

    PageResult findPage(int page, int size);

    void save(TbBrand tbBrand);

    void update(TbBrand tbBrand);

    TbBrand findOne(Long id);

    void delete(Long[] ids);

    /**
     * 条件查询-分页展示
     * @param tbBrand
     * @param size
     * @param page
     * @return
     */
    PageResult findPage(TbBrand tbBrand, int size, int page);

    List<Map> selectOptionList();
}
