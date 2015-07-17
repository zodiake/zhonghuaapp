var recommand = angular.module('Recommand', []);

recommand.service('RecommandService', ['$http', function ($http) {
    this.findByOption = function (option) {
        return $http.get('/admin/suggestion', {
            params: option
        });
    };
}]);

recommand.controller('RecommandController', ['$scope', 'RecommandService', function ($scope, RecommandService) {
    $scope.option = {};

    $scope.currentPage = 1;
    $scope.size = 15;

    function init(option) {
        RecommandService
            .findByOption(option)
            .then(function (data) {
                if (data.data.status == 'success') {
                    $scope.items = data.data.data.data;
                    $scope.total = data.data.data.total;
                } else {

                }
            })
            .catch(function (err) {

            });
    }

    init();

    $scope.search = function () {
        init({
            page: $scope.currentPage,
            size: $scope.size,
            state: $scope.option.state,
            beginTime: $scope.option.beginTime,
            endTime: $scope.option.endTime
        });
    };
}]);
