var order = angular.module('Order', []);

order.service('OrderService', ['$http', function($http) {
    this.findAll = function(option) {
        return $http.get('/admin/order/');
    }
}]);

order.controller('OrderController', ['$scope', function($scope) {

}]);
