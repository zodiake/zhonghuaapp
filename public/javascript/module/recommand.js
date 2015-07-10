var recommand = angular.module('Recommand', []);

recommand.controller('RecommandController', ['$scope', function($scope) {
    $scope.items = [{
        recommand_id: '1',
        con: 'asdsadfasfdasgfdasgsadg',
        status: '已读',
        date: '2015-07-09'
    }, {
        recommand_id: '2',
        con: 'ddddddddddddddddddddd',
        status: '已读',
        date: '2015-07-09'
    }]
}]);
