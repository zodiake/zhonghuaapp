var consignor = angular.module('Consignor', []);

consignor.service('ConsignorService', ['$http', function($http) {
    this.findAll = function(option) {
        return $http.get('/admin/users', option)
    }
}]);

consignor.controller('ConsignorController', ['$scope',
    'ConsignorService',
    function($scope, ConsignorService) {
        $scope.items = ConsignorService.findAll();
    }
]);
