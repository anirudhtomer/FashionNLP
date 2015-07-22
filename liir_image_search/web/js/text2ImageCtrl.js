susana.controller(
    'Text2ImageCtrl',
    ['$scope', '$http',
        function ($scope, $http) {

            var favoriteImages = [731, 503, 215, 218, 133, 235, 264, 204, 129, 5];

            $scope.totalWords = 100;
            $scope.items = [];

            var createItem = function(jsonObj){

                imgUrls = jsonObj.predicted_imgs.slice(0, 4);
                for (var j = 0; j < 4; j++) {
                    imgUrls[j] = imgUrls[j].split("data/")[1];
                }

                return {
                    imageUrls: imgUrls,
                    wordTrueProjection: jsonObj.words_true_proj.join().replace(/,/g, ", ").replace(/_/g, " ")
                };
            };

            $http({method: 'POST', url: 'json/txt2img'}).success(function (data) {

                var k=0;
                for(var i=0; i<favoriteImages.length; i++){
                    $scope.items[k++] = createItem(data.items[favoriteImages[i]]);
                }

                for (var i = 0; i < $scope.totalWords; i++) {
                    $scope.items[k++] = createItem(data.items[i]);
                }
            });
        }
    ]
);
