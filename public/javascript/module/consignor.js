var consignor = angular.module('Consignor', []);

consignor.service('ConsignorService', ['$http', function($http) {
    this.findAll = function(option) {
        return $http.get('/admin/consignor', {
            params: option
        });
    }
}]);

consignor.controller('ConsignorController', ['$scope',
    'ConsignorService',
    function($scope, ConsignorService) {
        $scope.option = {};
        $scope.currentPage = 1;
        $scope.size = 15;

        function init(option) {
            ConsignorService
                .findAll(option)
                .success(function(data) {
                    console.log(data);
                    if (data.status == 'success') {
                        $scope.items = data.data.data;
                        $scope.total = data.data.total;
                    } else {

                    }
                })
                .error(function(err) {

                });
        }
        init();

        $scope.search = function() {
            init({
                page: $scope.currentPage,
                size: $scope.size,
                mobile: $scope.option.mobile,
                activate: $scope.option.activate
            });
        };
    }
]);
