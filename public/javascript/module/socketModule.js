var socketModule = angular.module('socketModule', ['btford.socket-io']);

socketModule.factory('socketio', ['socketFactory', function (socketFactory) {
    var token = window.localStorage['user'];
    var url = 'http://localhost:3000/upload';
    var myIoSocket = io.connect(url, {
        query: 'token=' + token
    });

    mySocket = socketFactory({
        ioSocket: myIoSocket
    });

    console.log('called');
    return mySocket;
}]);
