susana.controller(
    'RawDataCtrl',
    ['$scope','$http',
        function ($scope,$http) {

            $scope.totalImages = 30;  /*always a multiple of 2*/

            $scope.rowIndexArray = [];
            for(var i=0;i<$scope.totalImages/2;i++) {
                $scope.rowIndexArray.push(i);
            }

            $scope.items = [];
            $http({method: 'POST', url: 'json/rawdata.json'}).success(function(data) {
                for(var i=0; i<$scope.totalImages; i++){
                    $scope.items[i] = {
                        imageUrl: "images/" + data.dresses[i].folder + "/" + data.dresses[i].asin + ".jpg",
                        description: data.dresses[i].editorial,
                        features: data.dresses[i].features,
                        title: data.dresses[i].title
                    }
                }
            });
        }
    ]
);
