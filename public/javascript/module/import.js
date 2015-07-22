var importOrder = angular.module('Import', ['socketModule']);

importOrder.service('importService', ['$http', function ($http) {
    this.fakeSocket = function (path) {
        $http.get('/admin/csv');
    }
}]);

importOrder.controller('ImportController', [
    '$scope',
    'socketio',
    'importService',
    '$http',
    function ($scope, socketio, importService, $http) {
        $scope.fails = [];

        importService.fakeSocket();

        socketio.on('fail', function (data) {
            $scope.fails.push(data);
        });

        socketio.on('finish', function (data) {
            console.log(data);
        });

        $scope.upload = function (event) {
            console.log(22);
            var file = event.target.files[0];
            var fd = new FormData();

            var reader = new FileReader();

            fd.append('file', file);

            $http.post('/admin/csv', fd, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                })
                .success(function (data) {
                    $scope.file = data;
                });
        };

        $scope.beginImport = function () {
            if (!$scope.file) {
                alert('null');
                return;
            }
            socketio.emit('begin', {
                file: $scope.file
            });
        }
    }

]);
