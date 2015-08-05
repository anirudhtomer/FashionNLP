susana.controller(
    'DemoPageCtrl',
    ['$scope',
        function ($scope) {
            $scope.demotypeList = [
                {
                    title: "Raw Data",
                    description: "We show the original image and text pairs here. We parse the description of images to get meaningful projection of words.",
                    templateUrl: "html/rawdata.html"
                },
                {
                    title: "Text to Image",
                    description: "Given a textual query we find the most likely images which contain the attributes corresponding the keywords given in the query.",
                    templateUrl: "html/text2image.html"
                },
                {
                    title: "Image to Text",
                    description: "Given a query image we generate words that explain the image best. The likelihood of each word per image is also presented.",
                    templateUrl: "html/image2text.html"
                },
                {
                    title: "Find Similar Images",
                    description: "Given a query image we find images which are similar to it.",
                    templateUrl: "html/findsimilar.html"
                }
            ];

            $scope.showDemo = function(templateUrl){
                $scope.demoTypeUrl = templateUrl;
            };
        }
    ]
);
