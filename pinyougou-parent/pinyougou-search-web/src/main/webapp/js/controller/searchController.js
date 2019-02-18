app.controller("searchController", function ($scope, searchService) {

    //初始化搜索对象
    $scope.searchMap = {
        "keywords": "",
        "category": "",
        "brand": "",
        "spec": {},
        "price": "",
        "pageNo": 1,
        "pageSize": 40
    };

    //添加搜索项
    $scope.addSearchItem = function (key, value) {
        //若是分类或品牌
        if (key == "category" || key == "brand" || key == "price") {
            $scope.searchMap[key] = value;
        } else {
            //若是规格
            $scope.searchMap.spec[key] = value;
        }

        $scope.search();
    };

    //移除搜索项
    $scope.removeSearchItem = function (key) {
        if (key == "category" || key == "brand" || key == "price") {
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
            buildPageLabel();
        });
    };

    //构建分页标签
    buildPageLabel = function () {
        $scope.pageLabel = [];//新增分页栏属性
        var maxPageNo = $scope.resultMap.totalPage;//最大页码
        var firstPage = 1;//第一页
        var lastPage = maxPageNo;//最后页
        $scope.firstDot = true;//前面有点
        $scope.lastDot = true;//后面有点
        if ($scope.resultMap.totalPage > 5) {//总页码大于5，显示部分页码
            if ($scope.searchMap.pageNo <= 3) {
                lastPage = 5;
                $scope.firstDot = false;//前面没点
            } else if ($scope.searchMap.pageNo >= maxPageNo - 2) {//当前页大于等于最大页码-2
                firstPage = maxPageNo - 4;
                $scope.lastDot = false;//后面没点
            } else {
                firstPage = $scope.searchMap.pageNo - 2;
                lastPage = firstPage+4;
            }
        } else {
            $scope.firstDot = false;//前面没点
            $scope.lastDot = false;//后面没点
        }
        //循环生成页码标签
        for (var i = firstPage; i <= lastPage; i++) {
            $scope.pageLabel.push(i);
        }
    };

    //根据页码查询
    $scope.queryByPage = function (pageNo) {
        //页码验证
        if (pageNo < 1 || pageNo > $scope.resultMap.totalPage) {
            return;
        }
        $scope.searchMap.pageNo = pageNo;
        $scope.search();
    }

    //判断当前页为第一页
    $scope.isTopPage=function(){
        if($scope.searchMap.pageNo==1){
            return true;
        }else{
            return false;
        }
    }

    //判断当前页是否未最后一页
    $scope.isEndPage=function(){
        if($scope.searchMap.pageNo==$scope.resultMap.totalPages){
            return true;
        }else{
            return false;
        }
    }
});