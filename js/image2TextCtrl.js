susana.controller(
    'Image2TextCtrl',
    ['$scope','$http',
        function ($scope,$http) {
            $scope.totalImages = 999;  /*always a multiple of 3*/

            $scope.rowIndexArray = [];
            for(var i=0;i<$scope.totalImages/3;i++) {
                $scope.rowIndexArray.push(i);
            }

            $scope.items = [];
            $http({method: 'POST', url: 'json/img2txt.json'}).success(function(data) {
                for(var i=0; i<$scope.totalImages; i++){
                    $scope.items[i] = {
                        imageUrl: data.items[i].folder.split("data/")[1] +  data.items[i].img_filename,
                        wordsPredicted: data.items[i].words_predicted.replace(/ /g, ", ").replace(/_/g," ")
                    }
                }
            });
        }
    ]
);
