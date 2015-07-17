susana.controller(
    'Text2ImageCtrl',
    ['$scope','$http',
        function ($scope,$http) {

            $scope.totalWords = 1000;
            $scope.items = [];

            $http({method: 'POST', url: 'json/txt2img.json'}).success(function(data) {
                for(var i=0; i<$scope.totalWords; i++){

                    imgUrls = data.items[i].predicted_imgs.slice(0, 4);
                    for(var j=0;j<4;j++){
                        imgUrls[j] = imgUrls[j].split("data/")[1];
                    }

                    $scope.items[i] = {
                        imageUrls: imgUrls,
                        wordTrueProjection: data.items[i].words_true_proj.join().replace(/,/g,", ").replace(/_/g," ")
                    }
                }
            });
        }
    ]
);
