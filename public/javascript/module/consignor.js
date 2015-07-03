var consignor = angular.module('Consignor', []);

consignor.service('ConsignorService', ['$http', function($http) {
    this.findAll = function(option) {
        return $http.get('/admin/users', {
            params: option
        });
    }
}]);

consignor.controller('ConsignorController', ['$scope',
    'ConsignorService',
    function($scope, ConsignorService) {
        (function() {
            ConsignorService
                .findAll()
                .success(function(data) {
                    $scope.items = data.data;
                })
                .error(function(err) {

                });
        }());

        $scope.option = {};
        $scope.search = function() {
            ConsignorService
                .findAll($scope.option)
                .success(function(data) {
                    $scope.items = data.data;
                })
                .error(function(err) {

                });
        };
    }
]);
