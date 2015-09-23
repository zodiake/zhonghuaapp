var socketModule = angular.module('socketModule', ['btford.socket-io']);

socketModule.factory('socketio', ['socketFactory', '$window', function (socketFactory) {
    var token = window.localStorage['user'];
    var url = 'http://192.168.1.66:3000/upload';
    var myIoSocket = io.connect(url, {
        query: 'token=' + token
    });

    mySocket = socketFactory({
        ioSocket: myIoSocket
    });

    return mySocket;
}]);
