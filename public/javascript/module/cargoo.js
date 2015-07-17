var cargoo = angular.module('Cargoo', []);

cargoo.service('CargooService', ['$http', function ($http) {
    this.findAll = function (id) {
        return $http.get('/admin/category');
    };
}]);

cargoo.controller('CargooController', [
    '$scope',
    'CargooService',
    function ($scope, cargooService) {
        cargooService
            .findAll()
            .then(function (data) {
                $scope.fuel = data.data.data['1'];
                $scope.oil = data.data.data['2'];
                $scope.chemistry = data.data.data['3'];
                $scope.others = data.data.data['4'];
            });
    }
]);
