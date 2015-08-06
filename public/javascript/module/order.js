var order = angular.module('Order', []);

order.service('OrderService', ['$http', function ($http) {
    this.findAll = function (option) {
        return $http.get('/admin/orders', {
            params: option
        });
    };
    this.findByOrderId = function (orderId) {
        return $http.get('/admin/orders/' + orderId);
    };
    this.update = function (item) {
        return $http.put('/admin/orders/' + item.id, item);
    };
}]);

order.service('CategoryService', ['$http', function ($http) {
    this.findByParent = function (parentId) {
        return $http.get('/category?id=' + parentId, {
            cache: true
        });
    }
    this.findFirst = function () {
        return $http.get('/category', {
            cache: true
        });
    }
}]);

order.service('OrderGisService', ['$http', function ($http) {
    this.findByOrderId = function (id) {
        return $http.get('/orders/' + id + '/geo');
    }
}]);

order.controller('OrderController', ['$scope', 'OrderService', function ($scope, OrderService) {
    $scope.currentPage = 1;
    $scope.size = 15;

    $scope.option = {};

    function init(option) {
        OrderService
            .findAll(option)
            .then(function (data) {
                if (data.data.status == 'success') {
                    $scope.items = data.data.data.data;
                    $scope.total = data.data.data.total;
                } else {

                }
            }).catch(function (err) {

            });
    }

    init();

    $scope.search = function () {
        init({
            page: $scope.currentPage,
            size: $scope.size,
            state: $scope.option.state,
            begin_time: $scope.option.begin_time,
            end_time: $scope.option.end_time,
            orderNumber: $scope.option.orderNumber,
            consignor: $scope.option.consignor
        });
    };

}]);

order.controller('OrderDetailController', [
    '$scope',
    '$stateParams',
    'OrderService',
    'CategoryService',
    '$q',
    function ($scope, $stateParams, OrderService, CategoryService, $q) {
        function init() {
            var array = [
                OrderService.findByOrderId($stateParams.id),
                CategoryService.findFirst()
            ];
            $q.all(array)
                .then(function (data) {
                    $scope.item = data[0].data.data;
                    console.log($scope.item);
                    $scope.categories = data[1].data.data;
                    return CategoryService.findByParent($scope.item.category)
                })
                .then(function (data) {
                    $scope.cargooNames = data.data.data;
                });
        }
        init();

        $scope.changeState = function (category) {
            CategoryService
                .findByParent(category)
                .then(function (data) {
                    $scope.cargooNames = data.data.data;
                });
        };

        $scope.update = function () {
            if (!$scope.orderForm.$valid) {
                alert(22);
                return;
            }
            OrderService
                .update($scope.item)
                .then(function (data) {
                    console.log(data);
                })
                .catch(function (err) {

                });
        };
    }
]);

order.controller('OrderMapController', [
    '$scope',
    '$stateParams',
    'OrderGisService',
    function ($scope, $stateParams, OrderGisService) {
        $scope.mapOptions = {
            zoom: 15,
            markers: [],
            center: {}
        };
        OrderGisService
            .findByOrderId($stateParams.id)
            .then(function (data) {
                if (data.data.data.length > 0) {
                    $scope.mapOptions.markers = data.data.data;
                    $scope.mapOptions.center = data.data.data[0];
                } else {
                    alert('null');
                    $scope.mapOptions.markers = [];
                    $scope.mapOptions.center = {
                        longitude: 116.404,
                        latitude: 39.915
                    };
                }
            })
    }
]);
