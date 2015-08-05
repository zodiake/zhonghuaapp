var cargoo = angular.module('Cargoo', []);

cargoo.service('CargooService', ['$http', function ($http) {
    this.findAll = function (id) {
        return $http.get('/admin/category');
    };

    this.updateState = function (item) {
        var state = item.activate == 1 ? 0 : 1;
        return $http.put('/admin/category/state', {
            id: item.id,
            state: state
        });
    };

    this.save = function (item) {
        return $http.post('/admin/category', item);
    }
}]);

cargoo.controller('CargooController', [
    '$scope',
    'CargooService',
    '$modal',
    function ($scope, cargooService, $modal) {
        cargooService
            .findAll()
            .then(function (data) {
                $scope.fuel = data.data.data['1'];
                $scope.oil = data.data.data['2'];
                $scope.chemistry = data.data.data['3'];
                $scope.others = data.data.data['4'];
            });

        $scope.changeState = function (item) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'myModalContent.html',
                controller: 'CargooInstanceCtrl',
                resolve: {
                    item: function () {
                        return item;
                    }
                }
            });
        };
    }
]);

cargoo.controller('CargooAddController', ['$scope', 'CargooService', function ($scope, CargooService) {
    $scope.item = {};

    $scope.submit = function () {
        CargooService
            .save($scope.item)
            .then(function (data) {
                console.log(data);
            })
    };
}]);

cargoo.controller('CargooInstanceCtrl', [
    '$scope',
    '$modalInstance',
    'item',
    'CargooService',
    function ($scope, $modalInstance, item, CargooService) {
        $scope.item = item;
        $scope.ok = function () {
            CargooService
                .updateState(item)
                .success(function (data) {
                    if (data.status == 'success') {
                        item.activate = item.activate == 1 ? 0 : 1;
                    }
                    $modalInstance.close();
                })
        }

        $scope.cancel = function () {
            $modalInstance.dismiss();
        }
    }
])
