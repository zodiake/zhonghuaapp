var scrollImage = angular.module('ScrollImage', []);

scrollImage.service('ScrollImageService', ['$http', function ($http) {
    this.findAll = function () {
        return $http.get('/admin/scrollImages');
    };
}]);

scrollImage.controller('ScrollController', [
    '$scope',
    'Upload',
    'ScrollImageService',
    function ($scope, Upload, ScrollImageService) {
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

        $scope.upload = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    console.log(file.url);
                    Upload.upload({
                        url: '/admin/image/upload',
                        fields: {
                            'username': $scope.username
                        },
                        file: file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    }).error(function (data, status, headers, config) {
                        console.log('error status: ' + status);
                    })
                }
            }
        };
    }
]);
