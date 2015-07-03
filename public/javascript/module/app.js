var app = angular.module('app', ['angular-jwt', 'ui.router', 'Login', 'Consignor']);

app.config(['$stateProvider',
    '$urlRouterProvider',
    'jwtInterceptorProvider',
    '$httpProvider',
    function($stateProvider, $urlRouterProvider, jwtInterceptorProvider, $httpProvider) {
        jwtInterceptorProvider.tokenGetter = ['$window', function($window) {
            return window.localStorage['user']
        }];

        $httpProvider.interceptors.push('jwtInterceptor');

        $urlRouterProvider.otherwise("/login");

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: '/template/login.html',
                controller: 'LoginController'
            })
            .state('tabs', {
                url: '/tabs',
                templateUrl: '/template/tabs.html',
                abstract: true
            })
            .state('tabs.consignor', {
                url: '/consignor',
                templateUrl: '/template/consignor.html',
                controller: 'ConsignorController'
            });
    }
]);
