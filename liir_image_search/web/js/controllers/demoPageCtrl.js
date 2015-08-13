susana.controller(
    'DemoPageCtrl',
    ['$scope', 'DataService',
        function ($scope, DataService) {

            $scope.isDemoModeActive = true;

            $scope.demotypeList = [
                {
                    title: "Raw Data",
                    description: "We show a sample of the original image and text pairs here.",
                    templateUrl: "html/rawdata.html"
                },
                {
                    title: "Text to Image",
                    description: "Given a textual query we find the relevant images.",
                    templateUrl: "html/text2image.html"
                },
                {
                    title: "Image to Text",
                    description: "Given a query image we generate relevant words.",
                    templateUrl: "html/image2text.html"
                }
            ];

            DataService.registerCallbackDemoModeActive(function (isDemoModeActive) {
                $scope.isDemoModeActive = isDemoModeActive;
                if(isDemoModeActive===false){
                    $scope.demotypeList.push( {
                        title: "Find Similar Images",
                        description: "Given a query image we find similar images.",
                        templateUrl: "html/findsimilar.html"
                    });
                }
            });

            $scope.showDemo = function (templateUrl) {
                $scope.demoTypeUrl = templateUrl;
            };
        }
    ]
);
