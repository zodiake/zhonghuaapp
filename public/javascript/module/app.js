var app = angular.module('app', ['ui.router', 'Login']);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/login");

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: '/template/login.html',
                controller: 'LoginController'
            })
            .state('consignor', {
                url: '/consignor',
                templateUrl: '/template/consignor.html',
                controller: 'ConsignorController'
            });
    }
]);
