var tabs = angular.module('Tabs', []);

tabs.controller('TabsController', ['$scope', function ($scope) {
    $scope.tabData = [{
        heading: '货主管理',
        route: 'tabs.consignor'
    }, {
        heading: '司机管理',
        route: 'tabs.consignee',
    }, {
        heading: '运单管理',
        route: 'tabs.order',
    }, {
        heading: '运单import',
        route: 'tabs.importOrder',
    }, {
        heading: '货物管理',
        route: 'tabs.cargoo',
    }, {
        heading: '轮播图广告',
        route: 'tabs.scrollImage',
    }, {
        heading: '消息推送',
        route: 'tabs.message',
    }, {
        heading: '用户统计',
        route: 'tabs.user',
    }, {
        heading: '运单统计',
        route: 'tabs.orderReport',
    }, {
        heading: '建议反馈',
        route: 'tabs.recommand',
    }];
}]);
