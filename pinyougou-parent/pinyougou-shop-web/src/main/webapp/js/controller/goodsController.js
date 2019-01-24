//控制层
app.controller('goodsController', function ($scope, $controller,typeTemplateService, uploadService, goodsService, itemCatService) {

    $controller('baseController', {$scope: $scope});//继承

    //读取列表数据绑定到表单中  
    $scope.findAll = function () {
        goodsService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    }

    //分页
    $scope.findPage = function (page, rows) {
        goodsService.findPage(page, rows).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    //查询实体
    $scope.findOne = function (id) {
        goodsService.findOne(id).success(
            function (response) {
                $scope.entity = response;
            }
        );
    }

    //保存
    $scope.save = function () {
        var serviceObject;//服务层对象
        if ($scope.entity.id != null) {//如果有ID
            serviceObject = goodsService.update($scope.entity); //修改
        } else {
            serviceObject = goodsService.add($scope.entity);//增加
        }
        serviceObject.success(
            function (response) {
                if (response.success) {
                    //重新查询
                    $scope.reloadList();//重新加载
                } else {
                    alert(response.message);
                }
            }
        );
    }

    //添加
    $scope.add = function () {
        //获取编辑器内容
        $scope.entity.goodsDesc.introduction = editor.html();
        goodsService.add($scope.entity).success(
            function (response) {
                if (response.success) {
                    alert(response.message);
                    //清空编辑器
                    $scope.entity = {};
                    editor.html("");
                } else {
                    alert(response.message);
                }
            }
        );
    }
    //批量删除
    $scope.dele = function () {
        //获取选中的复选框
        goodsService.dele($scope.selectIds).success(
            function (response) {
                if (response.success) {
                    $scope.reloadList();//刷新列表
                }
            }
        );
    }

    $scope.searchEntity = {};//定义搜索对象

    //搜索
    $scope.search = function (page, rows) {
        goodsService.search(page, rows, $scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    /**
     * 上传图片
     */
    $scope.uploadFile = function () {
        uploadService.uploadFile().success(function (response) {
            if (response.success) {
                $scope.image_entity.url = response.message;//设置文件地址
            } else {
                alert(response.message);
            }
        }).error(function () {
            alert("上传发生错误");
        });
    };

    $scope.entity = {goods: {}, goodsDesc: {itemImages: [],specificationItems:[]}};//定义集合格式
    //添加图片列表
    $scope.add_image_entity = function () {
        $scope.entity.goodsDesc.itemImages.push($scope.image_entity);
    }

    //列表中移除图片
    $scope.remove_image_entity = function (index) {
        $scope.entity.goodsDesc.itemImages.splice(index, 1);
    };

    //获取一级分类下拉列表
    $scope.selectItemCat1List = function () {
        itemCatService.findByParentId(0).success(function (response) {
            $scope.itemCat1List = response;
        });

    };
    //获取二级分类下拉列表
    $scope.$watch("entity.goods.category1Id", function (newValue, oldValue) {
        itemCatService.findByParentId(newValue).success(function (response) {
            $scope.itemCat2List = response;
        });
    });

    //获取三级分类下拉列表
    $scope.$watch("entity.goods.category2Id", function (newValue, OldValue) {
        itemCatService.findByParentId(newValue).success(function (response) {
            $scope.itemCat3List = response;
        });
    });

    //获取模板Id
    $scope.$watch("entity.goods.category3Id", function (newValue, oldValue) {
        itemCatService.findOne(newValue).success(function (response) {
            $scope.entity.goods.typeTemplateId = response.typeId;

        });
    });

    //获取模板信息  以及规格选项
    $scope.$watch("entity.goods.typeTemplateId", function (newValue, oldValue) {
        typeTemplateService.findOne(newValue).success(function (response) {
            $scope.typeTemplate = response;
            $scope.typeTemplate.brandIds = JSON.parse(response.brandIds);
            $scope.entity.goodsDesc.customAttributeItems = JSON.parse(response.customAttributeItems);
        });
        typeTemplateService.findSpecList(newValue).success(function (response) {
            $scope.specList = response;

        });
    });

    //更新specificationItems集合
    $scope.updateSpecAttribute = function ($event,name,value) {
        var obj = $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems,"attributeName",name);
        if (obj != null) {
            if ($event.target.checked) {//往集合加元素
                obj.attributeValue.push(value);
            } else {//从集合删除元素
                obj.splice(obj.attributeValue.indexOf(value),1);
                if (obj.attributeValue.lengh == 0) {//集合长度为0，移除整条记录
                    $scope.entity.goodsDesc.specificationItems.splice($scope.entity.goodsDesc.specificationItems.indexOf(obj), 1);
                }
            }
        } else {
            $scope.entity.goodsDesc.specificationItems.push({"attributeName": name, "attributeValue": [value]});
        }

    };


});	
