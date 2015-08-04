susana.controller(
    'Image2TextCtrl',
    ['$scope', '$http','$timeout', 'DataService',
        function ($scope, $http, $timeout, DataService) {

            var MIN_IMAGES_TO_SHOW = 12;
            var LOAD_MORE_IMAGES_COUNT = 10;

            var IMAGES_PER_ROW = 2;
            var LOADED_ATLEAST_ONCE = "LOADED_ATLEAST_ONCE";

            $scope.images = [];

            $scope.demoModeActive = DataService.isDemoModeActive();
            $scope.checkboxStates = {};
            $scope.tags = "";
            $scope.feedbackThanksStyle = {};

            $scope.incrementPaginationNumber = function (number) {
                if (number > 3) {
                    return 4;
                }
                else {
                    return number + 1;
                }
            };

            $scope.decrementPaginationNumber = function (number) {
                if (number <2 ) {
                    return 1;
                }
                else {
                    return number - 1;
                }
            };

            $scope.loadMoreImages = function () {
                if ($scope.imgRowCountSequence.length * IMAGES_PER_ROW < $scope.images.length) {
                    var remainingImages = $scope.images.length - $scope.imgRowCountSequence.length * IMAGES_PER_ROW;
                    var newLength = $scope.imgRowCountSequence.length + ((LOAD_MORE_IMAGES_COUNT < remainingImages) ? Math.ceil(LOAD_MORE_IMAGES_COUNT / IMAGES_PER_ROW) : Math.ceil(remainingImages / IMAGES_PER_ROW));
                    $scope.imgRowCountSequence = new Array(newLength);
                }
            };

            function getSelectedImageIds(){
                var imgIdArray = [];
                for(imgid in $scope.checkboxStates){
                    if($scope.checkboxStates.hasOwnProperty(imgid)){
                        imgIdArray.push(parseInt(imgid));
                    }
                }

                return imgIdArray;
            }

            $scope.submitTags = function(){
                var imgIdArray = getSelectedImageIds();
                if(imgIdArray.length > 0){
                    var tags = $scope.tags.trim()
                    if(tags.charAt(tags.length - 1)==','){
                        tags = tags.substring(0, $scope.tags.length - 1);
                    }
                    $http({
                        method: 'POST',
                        url: 'store/tags',
                        data: {'images_id_array': imgIdArray, 'tags': tags}
                    }).success(showThanksMsg);
                }
            };

            $scope.reportMisclassified = function(){
                var imgIdArray = getSelectedImageIds();
                if(imgIdArray.length > 0){
                    $http({
                        method: 'POST',
                        url: 'store/misclassfiedimages',
                        data: {'images_misclassified_array': imgIdArray}
                    }).success(showThanksMsg);
                }
            };

            function showThanksMsg(){
                $scope.feedbackThanksStyle = {'opacity': 1.0};
                $timeout(function(){$scope.feedbackThanksStyle = {}}, 2000);
            }

            $scope.searchImages = function (filterKeywords) {
                if (filterKeywords.length === 0) {
                    $scope.images = DataService.retrieveData(IMAGE_2_TEXT_IMAGES);
                } else {
                    $scope.images = DataService.searchImg2TxtImages(filterKeywords);
                }
                $scope.imgRowCountSequence = new Array(($scope.images.length > MIN_IMAGES_TO_SHOW) ? Math.ceil(MIN_IMAGES_TO_SHOW / IMAGES_PER_ROW) : Math.ceil($scope.images.length / IMAGES_PER_ROW));
            };

            if (angular.isUndefined(DataService.retrieveData(LOADED_ATLEAST_ONCE))) {
                $scope.searchImages([]);
                DataService.storeData(LOADED_ATLEAST_ONCE, true);
            }
        }
    ]
);
