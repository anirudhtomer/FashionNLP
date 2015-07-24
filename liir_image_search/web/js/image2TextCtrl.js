susana.controller(
    'Image2TextCtrl',
    ['$scope', '$http', 'DataService',
        function ($scope, $http, DataService) {

            var favoriteImages = [57, 58, 68, 299, 75, 646, 647, 16, 286, 275, 204, 29];

            $scope.totalImages = 300;
            /*always a multiple of 3*/

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

            $scope.items = [];
            $http({method: 'POST', url: 'json/img2txt', data: {type: 'img2txt', heck: 'load'}}).success(function (data) {
                var k=0;

                for(var i=0; i<favoriteImages.length; i++){
                    $scope.items[k++] = createItem(data.items[favoriteImages[i]]);
                }

                for (var i = 0; i < $scope.totalImages; i++) {
                    $scope.items[k++] = createItem(data.items[i]);
                }
            });

        }
    ]
);
