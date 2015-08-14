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

                DataService.registerCallbackAppLabels(function(appLabels){
                    $scope.demotypeList[0].title = appLabels.rawdata_title;
                    $scope.demotypeList[0].description = appLabels.rawdata_description;

                    $scope.demotypeList[1].title = appLabels.txt2img_title;
                    $scope.demotypeList[1].description = appLabels.txt2img_description;

                    $scope.demotypeList[2].title = appLabels.img2txt_title;
                    $scope.demotypeList[2].description = appLabels.img2txt2_description;

                    if(isDemoModeActive===false){
                        $scope.demotypeList[3].title = appLabels.find_similar_images_title;
                        $scope.demotypeList[3].description = appLabels.find_similar_images_description;
                    }
                });
            });

            $scope.showDemo = function (templateUrl) {
                $scope.demoTypeUrl = templateUrl;
            };
        }
    ]
);
