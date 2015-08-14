susana.controller(
    'MainCtrl',
    ['$scope', 'DataService',
        function ($scope, DataService) {
            //DataService is included to load vocabulary in advance before any controller: to be replaced with promises

            $scope.onBodyClicked = function () {
                var searchboxCallbackMap = DataService.retrieveData(SEARCH_BOX_CALLBACK_MAP);
                if (angular.isDefined(searchboxCallbackMap)) {
                    for (var searchboxName in searchboxCallbackMap) {
                        if (searchboxCallbackMap.hasOwnProperty(searchboxName)) {
                            searchboxCallbackMap[searchboxName]();
                        }
                    }
                }
            };

            DataService.registerCallbackAppLabels(function(appLabels){
                $scope.appLabels = appLabels;
            });

            $scope.isBrowserIE = false;

            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");

            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer, return version number
               $scope.isBrowserIE = true;

        }
    ]
);
