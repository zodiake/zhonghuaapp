var order = angular.module('Order', []);

order.service('OrderService', ['$http', function ($http) {
    this.findAll = function (option) {
        return $http.get('/admin/orders', {
            params: option
        });
    };
    this.findByOrderId = function (orderId) {
        return $http.get('/admin/orders/' + orderId);
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
                    console.log($scope.item);
                });
        }
        init();
    }
])

order.controller('OrderMapController', ['$scope', function ($scope) {
    var longitude = 121.506191;
    var latitude = 31.245554;
    $scope.mapOptions = {
        center: {
            longitude: longitude,
            latitude: latitude
        },
        zoom: 17,
        markers: [{
            longitude: longitude,
            latitude: latitude,
            icon: 'img/mappiont.png',
            width: 49,
            height: 60,
            title: 'Where',
            content: 'Put description here'
        }]
    };
}]);
