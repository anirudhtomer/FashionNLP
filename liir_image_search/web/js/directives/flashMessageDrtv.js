susana.directive('flashMessage',
    ['$timeout',function ($timeout) {
        return {
            restrict: "A", //The directive can only be used as an attribute
            scope: {},
            link: function (scope, element, attrs) {
                if (angular.isString(attrs.flashMessage)) {
                    scope.$watch("$parent." + attrs.flashMessage, function (newVal, oldVal) {
                        if(newVal==true){
                            element.css("opacity", 1.0);
                            $timeout(function(){element.css("opacity", "");}, 2000);
                            scope.$parent[attrs.flashMessage] = false;
                        }
                    });
                }
            }
        };
    }]);
