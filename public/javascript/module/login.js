var login = angular.module('Login', []);

//all login service
login.service('LoginService', ['$http', function ($http) {
    this.login = function (user) {
        return $http.post('/users/admin/login', {
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
    '$window',
    function ($scope, LoginService, $state, $window) {
        $scope.user = {};
        $scope.login = function () {
            if ($scope.loginForm.$valid) {
                LoginService
                    .login($scope.user)
                    .success(function (data) {
                        $state.go('tabs.consignor');
                        $window.localStorage.user = data.token;
                        $window.localStorage.userName = $scope.user.name;
                    })
                    .error(function (err) {

                    });
            }
        }
    }
]);
