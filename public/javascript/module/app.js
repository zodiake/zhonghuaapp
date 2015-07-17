var app = angular.module('app', [
    'btford.socket-io',
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
    'Recommand',
    'User',
    'OrderReport',
    'Message',
    'Import',
    'baiduMap'
]);

app.config(['$stateProvider',
    '$urlRouterProvider',
    'jwtInterceptorProvider',
    '$httpProvider',
    function ($stateProvider, $urlRouterProvider, jwtInterceptorProvider, $httpProvider) {
        jwtInterceptorProvider.tokenGetter = ['$window', function ($window) {
            return window.localStorage.user;
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
                url: '/order/:id',
                templateUrl: '/template/orderDetail.html',
                controller: 'OrderDetailController'
            })
            .state('tabs.orderMap', {
                url: '/order/:id/map',
                templateUrl: '/template/map.html',
                controller: 'OrderMapController'
            })
            .state('tabs.importOrder', {
                url: '/import',
                templateUrl: '/template/import.html',
                controller: 'ImportController'
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
            })
            .state('tabs.user', {
                url: '/user',
                templateUrl: '/template/user.html',
                controller: 'UserController'
            })
            .state('tabs.orderReport', {
                url: '/orderReport',
                templateUrl: '/template/orderReport.html',
                controller: 'OrderReportController'
            })
            .state('tabs.message', {
                url: '/message',
                templateUrl: '/template/message.html',
                controller: 'MessageController'
            })
            .state('tabs.orderImport', {
                url: '/orderImport',
                templateUrl: '/template/orderImport.html',
                controller: 'CrderImportController'
            })
            .state('tabs.scrollImageAdd', {
                url: '/scrollImageAdd',
                templateUrl: '/template/scrollImageAdd.html',
                controller: 'ScrollImageAddController'
            })
            .state('tabs.cargooAdd', {
                url: '/cargooAdd',
                templateUrl: '/template/cargooAdd.html',
                controller: 'CargooAddController'
            })
            .state('tabs.recommandDetail', {
                url: '/recommandDetail',
                templateUrl: '/template/recommandDetail.html',
                controller: 'recommandDetailController'
            });
    }
]);
