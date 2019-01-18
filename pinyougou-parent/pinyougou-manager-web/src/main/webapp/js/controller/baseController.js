app.controller("baseController", function ($scope) {
    //分页控件配置
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 10,
        itemsPerPage: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            $scope.reloadList();
        }
    };

    //刷新页面
    $scope.reloadList = function () {
        $scope.search($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
        $scope.selectIds = [];
        $scope.select_all = false;
    };

    $scope.selectIds = [];//复选框的ID集合
    //复选框单个选择
    $scope.selectOne = function (is, id) {
        if (is) {//复选框选中
            $scope.selectIds.push(id);
            if ($scope.selectIds.length === $scope.list.length) {
                $scope.select_all = true;
            }
        } else {
            $scope.selectIds.splice($scope.selectIds.indexOf(id), 1);
            if ($scope.select_all) {
                $scope.select_all = false;
            }
        }
    };

    //复选框全选
    $scope.selectAll = function () {
        $scope.selectIds = [];
        if ($scope.select_all) {
            angular.forEach($scope.list, function (entity) {
                $scope.selectIds.push(entity.id);
                entity.checked = true;
            });
        } else {
            angular.forEach($scope.list, function (entity) {
                entity.checked = false;
            });
        }
    };
});