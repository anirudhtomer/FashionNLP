susana.controller(
    'Text2ImageCtrl',
    ['$scope', '$http', 'DataService',
        function ($scope, $http, DataService) {

            $scope.filteredImages = [];

            $scope.searchImages = function (filterKeywords) {
                if (filterKeywords.length > 0) {
                    $http({
                        method: 'POST',
                        url: 'search/text2image',
                        data: {keywords: filterKeywords}
                    }).success(function (data) {
                        $scope.filteredImages = data.images;
                        $scope.imageRowSequence = new Array(Math.ceil($scope.filteredImages.length / 4))
                    });
                } else {
                    $scope.filteredImages.length = 0;
                    $scope.imageRowSequence = new Array(0);
                }
            };

            $scope.undefinedFilter = function(imageRowNum,imageNum){
                return angular.isUndefined($scope.filteredImages[imageRowNum*4 + imageNum]);
            };
        }
    ]
);
