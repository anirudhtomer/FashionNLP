susana.controller(
    'Image2TextCtrl',
    ['$scope', '$http', 'DataService',
        function ($scope, $http, DataService) {

            var MIN_IMAGES_TO_SHOW = 12;
            var LOAD_MORE_IMAGES_COUNT = 9;

            var IMAGES_PER_ROW = 3;

            $scope.rowIndexArray = [];
            for (var i = 0; i < $scope.totalImages / 3; i++) {
                $scope.rowIndexArray.push(i);
            }

            var createItem = function (jsonObj) {
                return {
                    imageUrl: jsonObj.folder.split("data/")[1] + jsonObj.img_filename,
                    wordsPredicted: jsonObj.words_predicted.replace(/ /g, ", ").replace(/_/g, " ")
                };
            };

            $scope.images = [];
            $http({
                method: 'POST',
                url: 'json/img2txt',
                data: {type: 'img2txt', heck: 'load'}
            }).success(function (data) {
                for (var i = 0; i < data.items.length; i++) {
                    $scope.images[i] = createItem(data.items[i]);
                }


                $scope.imgRowCountSequence = new Array(($scope.images.length > MIN_IMAGES_TO_SHOW) ? Math.ceil(MIN_IMAGES_TO_SHOW / IMAGES_PER_ROW) : Math.ceil($scope.images.length / IMAGES_PER_ROW));
            });

            $scope.loadMoreImages = function () {
                if ($scope.imgRowCountSequence.length < $scope.images.length) {
                    var remainingImages = $scope.images.length - $scope.imgRowCountSequence.length;
                    var newLength = $scope.imgRowCountSequence.length + ((LOAD_MORE_IMAGES_COUNT < remainingImages) ? Math.ceil(LOAD_MORE_IMAGES_COUNT / IMAGES_PER_ROW) : Math.ceil(remainingImages/IMAGES_PER_ROW));
                    $scope.imgRowCountSequence = new Array(newLength);
                }
            };

            $scope.searchImages = function (filterKeywords) {

            };
        }
    ]
);
