susana.controller(
    'Image2TextCtrl',
    ['$scope', '$http', 'DataService',
        function ($scope, $http, DataService) {

            var MIN_IMAGES_TO_SHOW = 12;
            var LOAD_MORE_IMAGES_COUNT = 9;

            var IMAGES_PER_ROW = 2;
            var LOADED_ATLEAST_ONCE = "LOADED_ATLEAST_ONCE";

            $scope.images = [];

            $scope.loadMoreImages = function () {
                if ($scope.imgRowCountSequence.length < $scope.images.length) {
                    var remainingImages = $scope.images.length - $scope.imgRowCountSequence.length;
                    var newLength = $scope.imgRowCountSequence.length + ((LOAD_MORE_IMAGES_COUNT < remainingImages) ? Math.ceil(LOAD_MORE_IMAGES_COUNT / IMAGES_PER_ROW) : Math.ceil(remainingImages/IMAGES_PER_ROW));
                    $scope.imgRowCountSequence = new Array(newLength);
                }
            };

            $scope.searchImages = function (filterKeywords) {
                if(filterKeywords.length===0){
                    $scope.images = DataService.retrieveData(IMAGE_2_TEXT_IMAGES);
                }else{
                    $scope.images = DataService.searchImg2TxtImages(filterKeywords);
                }
                $scope.imgRowCountSequence = new Array(($scope.images.length > MIN_IMAGES_TO_SHOW) ? Math.ceil(MIN_IMAGES_TO_SHOW / IMAGES_PER_ROW) : Math.ceil($scope.images.length / IMAGES_PER_ROW));
            };


            if(angular.isUndefined(DataService.retrieveData(LOADED_ATLEAST_ONCE))) {
                $scope.searchImages([]);
                DataService.storeData(LOADED_ATLEAST_ONCE, true);
            }
        }
    ]
);
