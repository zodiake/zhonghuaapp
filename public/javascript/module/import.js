var importOrder = angular.module('Import', []);

importOrder.factory('socketio', ['socketFactory', function (socketFactory) {
    var token = window.localStorage['user'];
    var myIoSocket = io.connect('http://localhost:5000', {
        query: 'token=' + token
    });

    mySocket = socketFactory({
        ioSocket: myIoSocket
    });

    return mySocket;
}]);

importOrder.controller('ImportController', ['$scope', 'socketio', function ($scope, socketio) {
    socketio.on('hi', function (data) {
        console.log(data);
    });
}]);
