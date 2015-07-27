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
        $scope.alerts = [];

        importService.fakeSocket();

        socketio.on('fail', function (data) {
            $scope.fails.push(data);

        });

        socketio.on('finish', function (data) {
            delete $scope.file;
            $scope.alerts.push({
                type: 'success',
                message: 'import finish'
            });
        });

        $scope.upload = function (event) {
            console.log(11);
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
                    $scope.alerts.push({
                        type: 'success',
                        msg: '上传成功'
                    });
                })
                .error(function (err) {

                });
        };

        $scope.beginImport = function () {
            if (!$scope.file) {
                $scope.alerts.push({
                    type: 'danger',
                    msg: 'no file uploaded'
                });
                return;
            }
            socketio.emit('begin', {
                file: $scope.file
            });
        }

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };
    }

]);
