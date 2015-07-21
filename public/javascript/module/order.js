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
}]);

order.service('OrderGisService', ['$http', function ($http) {
    this.findByOrderId = function (id) {
        return $http.get('/orders/' + id + '/geo')
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
                    console.log($scope.total);
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
            mobile: $scope.option.mobile,
            orderId: $scope.option.orderId
        });
    };

}]);

order.controller('OrderDetailController', [
    '$scope',
    '$stateParams',
    'OrderService',
    function ($scope, $stateParams, OrderService) {
        function init() {
            OrderService
                .findByOrderId($stateParams.id)
                .then(function (data) {
                    $scope.item = data.data.data;
                });
        }
        init();
    }
])

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
                $scope.mapOptions.markers = data.data.data;
                $scope.mapOptions.center = data.data.data[0];
            })
    }
]);
