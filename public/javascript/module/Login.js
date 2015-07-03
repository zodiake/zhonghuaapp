var login = angular.module('Login', []);

//all login service
login.service('LoginService', ['$http', function($http) {
    this.login = function(user) {
        return $http.post('/users/login', {
            name: user.name,
            password: user.password
        });
    };
}]);

//all login controller
login.controller('LoginController', [
    '$scope',
    'LoginService',
    '$state',
    function($scope, LoginService, $state) {
        $scope.user = {};
        $scope.login = function() {
            if ($scope.loginForm.$valid) {
                LoginService
                    .login($scope.user)
                    .success(function(data) {
                        $state.go('consignor');
                    })
                    .error(function(err) {

                    });
            }
        }
    }
]);
