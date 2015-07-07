var order = angular.module('Order', []);

order.service('OrderService', ['$http', function($http) {
    this.findAll = function(option) {
        return $http.get('/admin/orders', {
            params: option
        });
    }
}]);

order.controller('OrderController', ['$scope', 'OrderService', function($scope, OrderService) {
    $scope.currentPage = 1;
    $scope.page = 15;

    function init() {
        OrderService.findAll({
            page: $scope.currentPage,
            size: $scope.page
        }).then(function(data) {
            if (data.data.status == 'success') {
                $scope.items = data.data.data.data;
                $scope.total = data.data.data.total;
            } else {

            }
        }).catch(function(err) {

        });
    }

    init();

    $scope.pageChanged = init;

}]);
