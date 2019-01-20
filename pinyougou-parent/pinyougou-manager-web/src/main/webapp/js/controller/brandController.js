app.controller("brandController", function ($scope, $controller, brandService) {
    $controller("baseController", {$scope: $scope});//继承

    $scope.searchEntity = {};//定义搜索对象


    //分页查询
    $scope.findPage = function (page, size) {
        brandService.findPage(page, size).success(function (response) {
            $scope.list = response.rows;
            $scope.paginationConf.totalItems = response.total;//更新总记录数
        });
    };

    //搜索查询
    $scope.search = function (page, size) {
        brandService.search(page, size, $scope.searchEntity).success(function (response) {
            $scope.paginationConf.totalItems = response.total;
            $scope.list = response.rows;
        });

    };

    //根据id查询
    $scope.findOne = function (id) {
        brandService.findOne(id).success(function (response) {
            $scope.entity = response;
        });
    };

    // 保存/新增
    $scope.save = function () {
        var object = brandService.save($scope.entity);
        if ($scope.entity.id != null) {
            object = brandService.update($scope.entity);
        }
        object.success(function (response) {
            if (response.success) {//成功
                $scope.reloadList();
            } else {
                alert(response.message);
            }
        });
    };

    //删除复选框选中的选项
    $scope.delete = function () {
        if (!confirm("确认删除？")) {
            return;
        }
        brandService.delete($scope.selectIds).success(function (response) {
            if (response.success) {//成功删除
                $scope.reloadList();
            } else {
                alert(response.message);
            }
        });
    };
});
