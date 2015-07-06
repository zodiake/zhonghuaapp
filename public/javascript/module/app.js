var app = angular.module('app', [
    'angular-jwt',
    'ui.router',
    'ui.bootstrap',
    'ui.router.tabs',
    'Tabs',
    'Login',
    'Consignor',
    'Order',
    'ScrollImage',
    'Cargoo',
    'Consignee',
    'Recommand'
]);

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
                abstract: true,
                controller: 'TabsController'
            })
            .state('tabs.consignor', {
                url: '/consignor',
                templateUrl: '/template/consignor.html',
                controller: 'ConsignorController'
            })
            .state('tabs.order', {
                url: '/order',
                templateUrl: '/template/order.html',
                controller: 'OrderController'
            })
            .state('tabs.orderDetail', {
                url: '/orderDetail',
                templateUrl: '/template/orderDetail.html',
                controller: 'OrderDetailController'
            })
            .state('tabs.scrollImage', {
                url: '/scrollImage',
                templateUrl: '/template/scrollImage.html',
                controller: 'ScrollController'
            })
            .state('tabs.cargoo', {
                url: '/cargoo',
                templateUrl: '/template/cargoo.html',
                controller: 'CargooController'
            })
            .state('tabs.consignee', {
                url: '/consignee',
                templateUrl: '/template/consignee.html',
                controller: 'ConsigneeController'
            })
            .state('tabs.recommand', {
                url: '/recommand',
                templateUrl: '/template/recommand.html',
                controller: 'RecommandController'
            });
    }
]);
