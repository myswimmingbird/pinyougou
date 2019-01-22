//控制层
app.controller('itemCatController', function ($scope, $controller, itemCatService, typeTemplateService) {

    $controller('baseController', {$scope: $scope});//继承

    //读取列表数据绑定到表单中  
    $scope.findAll = function () {
        itemCatService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    }

    //分页
    $scope.findPage = function (page, rows) {
        itemCatService.findPage(page, rows).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    //查询实体
    $scope.findOne = function (id) {
        itemCatService.findOne(id).success(
            function (response) {
                $scope.entity = response;
            }
        );
    }

    //保存
    $scope.save = function () {
        $scope.updateEntity();
        var serviceObject;//服务层对象
        if ($scope.entity.id != null) {//如果有ID
            serviceObject = itemCatService.update($scope.entity); //修改
        } else {
            serviceObject = itemCatService.add($scope.entity);//增加
        }
        serviceObject.success(
            function (response) {
                if (response.success) {
                    //重新查询
                    $scope.findByParentId($scope.parentId);//重新加载
                } else {
                    alert(response.message);
                }
            }
        );
    }


    //批量删除
    $scope.dele = function () {
        //获取选中的复选框
        itemCatService.dele($scope.selectIds).success(
            function (response) {
                if (response.success) {
                    $scope.findByParentId($scope.parentId);//刷新列表
                }
            }
        );
    }

    $scope.searchEntity = {};//定义搜索对象

    //搜索
    $scope.search = function (page, rows) {
        itemCatService.search(page, rows, $scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    //分页控件配置
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 10,
        itemsPerPage: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            $scope.findByParentId($scope.entity.parentId);
        }
    };

    //根据parentId查询
    $scope.findByParentId = function (id) {
        itemCatService.findByParentId(id).success(function (response) {
            $scope.list = response;
        });

    };

    $scope.grade = 1;//级别
    //设置级别
    $scope.setGrade = function (value) {
        $scope.grade = value;
    };

    //读取列表
    $scope.selectList = function (entity) {
        $scope.parentId = entity.id;
        if ($scope.grade == 1) {
            $scope.entity_1 = null;
            $scope.entity_2 = null;
        }
        if ($scope.grade == 2) {
            $scope.entity_1 = entity;
            $scope.entity_2 = null;
        }
        if ($scope.grade == 3) {
            $scope.entity_2 = entity;
        }
        $scope.findByParentId(entity.id);
    };

    $scope.typeTemplateList = {data: []};//模板列表
    //获取模板列表
    $scope.findTypeTemplateList = function () {
        typeTemplateService.findTypeTemplateList().success(function (response) {
            $scope.typeTemplateList = {data: response}
        });
    };

    $scope.parentId = 0;//用于记录上级id
    $scope.updateEntity = function () {
        $scope.entity.parentId = $scope.parentId;
        $scope.entity.typeId = $scope.typeTemplate.id;
    };
});	
