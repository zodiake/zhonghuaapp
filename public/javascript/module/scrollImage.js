var scrollImage = angular.module('ScrollImage', []);

scrollImage.service('ScrollImageService', ['$http', function ($http) {
    this.findAll = function () {
        return $http.get('/admin/scrollImages');
    };
}]);

scrollImage.directive('fileUpload', function () {
    // Runs during compile
    return {
        restrict: 'A',
        link: function ($scope, element, attrs, controller) {
            var onChangeHandler = $scope.$eval(attrs.fileUpload);
            element.bind('change', onChangeHandler);
        }
    };
});

scrollImage.controller('ScrollController', [
    '$scope',
    '$window',
    'ScrollImageService',
    '$http',
    function ($scope, $window, ScrollImageService, $http) {
        function init() {
            ScrollImageService
                .findAll()
                .then(function (data) {
                    $scope.items = data.data.data;
                })
                .catch(function (err) {

                });
        }

        init();

        $scope.upload = function (event) {
            var file = event.target.files[0];
            var fd = new FormData();
            var index = event.target.getAttribute('index');

            var reader = new FileReader();

            fd.append('file', file);
            fd.append('id', event.target.getAttribute('id'));

            $http.post('/admin/scrollImages', fd, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                })
                .success(function (data) {
                    var str = data.substring(data.indexOf('\/') + 1);
                    $scope.items[index].image_url = '/' + str;
                })
        };
    }
]);
