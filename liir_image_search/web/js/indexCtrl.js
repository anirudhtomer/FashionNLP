susana.controller(
    'IndexCtrl',
    ['$scope', 'DataService',
        function ($scope, DataService) {
            //DataService is included to load vocabulary in advance before any controller: to be replaced with promises

            $scope.demotypeList = [
                {
                    title: "Raw Data",
                    description: "Here we show the original image and text pairs.",
                    templateUrl: "html/rawdata.html"
                },
                {
                    title: "Text to Image",
                    description: "Given a textual query we find the most likely images which contain the attributes corresponding the keywords given in the query.",
                    templateUrl: "html/text2image.html"
                },
                {
                    title: "Image to Text",
                    description: "Given a query image we generate words which best explain the image. The words per image are sorted by their likelihood of explaining the image in our model.",
                    templateUrl: "html/image2text.html"
                }
            ];

            $scope.showDemo = function(templateUrl){
                $scope.demoTypeUrl = templateUrl;
            };
        }
    ]
);
