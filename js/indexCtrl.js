susana.controller(
    'IndexCtrl',
    ['$scope',
        function ($scope) {
            $scope.demotypeList = [
                {
                    title: "Raw Data",
                    description: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.",
                    templateUrl: "html/rawdata.html"
                },
                {
                    title: "Text to Image",
                    description: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.",
                    templateUrl: "html/text2image.html"
                },
                {
                    title: "Image to Text",
                    description: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.",
                    templateUrl: "html/image2text.html"
                }
            ];

            $scope.showDemo = function(templateUrl){
                $scope.demoTypeUrl = templateUrl;
            };
        }
    ]
);
