var consignee = angular.module('Consignee', ['filterModel']);

consignee.service('ConsigneeService', ['$http', function ($http) {
    this.findAll = function (option) {
        return $http.get('/admin/consignee', {
            params: option
        });
    }
}]);

consignee.controller('ConsigneeController', ['$scope',
    'ConsigneeService',
    function ($scope, ConsigneeService) {

        $scope.option = {};
        $scope.currentPage = 1;
        $scope.size = 15;

        function init(option) {
            ConsigneeService
                .findAll(option)
                .success(function (data) {
                    console.log(data);
                    if (data.status == 'success') {
                        $scope.items = data.data.data;
                        $scope.total = data.data.total;
                    } else {

                    }
                })
                .error(function (err) {

                });
        }

        init();

        $scope.search = function () {
            init({
                page: $scope.currentPage,
                size: $scope.size,
                mobile: $scope.option.mobile,
                activate: $scope.option.activate
            });
        };
    }
]);
