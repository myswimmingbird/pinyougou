app.controller("searchController", function ($scope, searchService) {

    //初始化搜索对象
    $scope.searchMap = {"keywords": "", "category": "", "brand": "", "spec": {}};

    //添加搜索项
    $scope.addSearchItem = function (key, value) {
        //若是分类或品牌
        if (key == "category" || key == "brand") {
            $scope.searchMap[key] = value;
        } else {
            //若是规格
            $scope.searchMap.spec[key] = value;
        }

        $scope.search();
    };

    //移除搜索项
    $scope.removeSearchItem = function (key) {
        if (key == "category" || key == "brand") {
            $scope.searchMap[key] = "";
        } else {
           delete $scope.searchMap.spec[key];
        }
        $scope.search();
    };
    //搜索
    $scope.search = function () {
        searchService.search($scope.searchMap).success(function (response) {
            $scope.resultMap = response;
        });
    };

});