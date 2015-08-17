var message = angular.module('Message', []);

message.service('MessageService', ['$http', function ($http) {
    this.push = function (message) {
        return $http.post('/admin/jpush', message);
    }
}]);

message.controller('MessageController', ['$scope', 'MessageService', function ($scope, MessageService) {
    $scope.push = {};

    $scope.submit = function () {
        MessageService
            .push($scope.push)
            .then(function (data) {

            });
    }
}]);
