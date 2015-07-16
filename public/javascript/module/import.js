var importOrder = angular.module('Import', []);

importOrder.factory('socketio', ['socketFactory', function (socketFactory) {
    var token = window.localStorage['user'];
    var url = 'http://localhost:3000/upload';
    var myIoSocket = io.connect(url, {
        query: 'token=' + token
    });

    mySocket = socketFactory({
        ioSocket: myIoSocket
    });

    return mySocket;
}]);

importOrder.service('importService', ['$http', function ($http) {
    this.fakeSocket = function () {
        $http.get('/admin/csvtest');
    }
}]);

importOrder.controller('ImportController', [
    '$scope',
    'socketio',
    'importService',
    function ($scope, socketio, importService) {
        importService.fakeSocket();
        $scope.fails = [];
        socketio.on('hi', function (data) {
            $scope.fails.push(data);
        });
        socketio.on('finish', function (data) {
            console.log(data);
        });
    }
]);
