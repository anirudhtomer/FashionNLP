susana.controller(
    'RawDataCtrl',
    ['$scope', '$http', 'DataService',
        function ($scope, $http, DataService) {

            var MIN_IMAGES_TO_SHOW = 12;
            var LOAD_MORE_IMAGES_COUNT = 10;

            var IMAGES_PER_ROW = 2;
            const IMAGE_ID_MAP = "imageIdMap";
            var imageIDRegex = new RegExp(/^\d+$/);
            $scope.maxImageId = 53688;

            $scope.search = {
                filterText: ""
            };

            $scope.filteredImages = [];
            $scope.areImagesFiltered = false;

            function searchImagesByFilterIds(imageIdList) {
                $scope.areImagesFiltered = true;
                $scope.filteredImages.length = 0;
                sendGetImagesHttpRequest(imageIdList, function (images) {
                    for (var i = 0; i < images.length; i++) {
                        $scope.filteredImages.push(createImageItem(images[i]));
                    }

                    $scope.rowCountSequence = new Array(Math.ceil(images.length / IMAGES_PER_ROW));
                });
            }

            function searchImagesWithoutFilter() {
                $scope.areImagesFiltered = false;
                var imageIdList = [];
                if ($scope.filteredImages.length == 0) {
                    //get first 20 images
                    for (i = 0; i < 20; i++) {
                        imageIdList.push(i);
                    }
                    $scope.rowCountSequence = new Array();
                }else{
                    for(i=$scope.filteredImages.length; i<$scope.filteredImages.length + LOAD_MORE_IMAGES_COUNT; i++){
                        imageIdList.push(i);
                    }
                }

                sendGetImagesHttpRequest(imageIdList, function(images){
                    for (var i = 0; i < images.length; i++) {
                        $scope.filteredImages.push(createImageItem(images[i]));
                    }

                    $scope.rowCountSequence = new Array(Math.ceil($scope.filteredImages.length/IMAGES_PER_ROW));
                });
            }

            function sendGetImagesHttpRequest(imageIdList, callback) {
                if (angular.isFunction(callback)) {
                    $http({
                        method: 'POST',
                        url: 'search/rawimages',
                        data: {'imageIdList': imageIdList}
                    }).success(function (data) {
                        callback(data.images);
                    });
                }
            }

            function createImageItem(jsonObj) {
                return {
                    imageUrl: "images/" + jsonObj.folder + "/" + jsonObj.asin + ".jpg",
                    description: jsonObj.editorial,
                    features: jsonObj.features,
                    title: jsonObj.title
                };
            }

            function searchImages() {
                var imageIdList = [];
                for (var imageId in $scope.filterImageIdMap) {
                    if ($scope.filterImageIdMap.hasOwnProperty(imageId)) {
                        //don't send key here as it is not a number
                        imageIdList.push($scope.filterImageIdMap[imageId]);
                    }
                }

                if (imageIdList.length > 0) {
                    searchImagesByFilterIds(imageIdList);
                } else {
                    searchImagesWithoutFilter();
                }
            }

            $scope.loadMoreImages = function () {
                if ($scope.rowCountSequence.length * IMAGES_PER_ROW < $scope.filteredImages.length) {
                    var remainingImages = $scope.filteredImages.length * IMAGES_PER_ROW - $scope.rowCountSequence.length;

                    if (LOAD_MORE_IMAGES_COUNT <= remainingImages) {
                        $scope.rowCountSequence = new Array($scope.rowCountSequence.length + Math.ceil(LOAD_MORE_IMAGES_COUNT / IMAGES_PER_ROW));
                    } else if ($scope.areImagesFiltered === true) {
                        $scope.rowCountSequence = new Array($scope.rowCountSequence.length + Math.ceil(remainingImages / IMAGES_PER_ROW));
                    } else {
                        searchImages();
                    }
                }else if($scope.areImagesFiltered===false){
                    searchImages();
                }
            };

            $scope.removeImageId = function (imageId) {
                delete $scope.filterImageIdMap[imageId];
                var count = 0;
                for (var imageId in $scope.filterImageIdMap) {
                    if ($scope.filterImageIdMap.hasOwnProperty(imageId)) {
                        count++;
                        break;
                    }
                }
                if(count==0){
                    $scope.filteredImages.length = 0;
                }
                searchImages();
            };

            $scope.addImageId = function (imageId) {
                if (angular.isUndefined($scope.filterImageIdMap[imageId])) {
                    $scope.filterImageIdMap[imageId] = imageId;
                    searchImages();
                }
            };

            $scope.onKeyPress = function ($event) {
                if ($event.which === 13 || $event.which == 32) {
                    if ($scope.isValidImageId($scope.search.filterText)) {
                        $scope.addImageId(parseInt($scope.search.filterText))
                    }
                }
            };

            $scope.isValidImageId = function (imageIdStr) {
                return imageIDRegex.test(imageIdStr) && parseInt(imageIdStr) <= $scope.maxImageId;
            };

            $scope.$watch('search.filterText', function () {
                if ($scope.search.filterText.length == 0 || $scope.isValidImageId($scope.search.filterText)) {
                    $scope.errorMessage = "";
                } else {
                    $scope.errorMessage = "Image ID should be a whole number between 0 and " + $scope.maxImageId;
                }
            });

            $scope.$on('$destroy', function () {
                DataService.storeData(IMAGE_ID_MAP, $scope.filterImageIdMap);
            });

            $scope.filterImageIdMap = DataService.retrieveData(IMAGE_ID_MAP);
            if (angular.isUndefined($scope.filterImageIdMap)) {
                $scope.filterImageIdMap = {};
            }

            searchImages();
        }
    ]
);
