susana.directive('autoScrollOn',
    [function () {
        return {
            restrict: "A", //The directive can only be used as an attribute
            link: function (scope, element, attrs) {
                if (angular.isDefined(attrs.autoScrollOn)) {
                    var watchObjNames = attrs.autoScrollOn.split(",");
                    for(var i=0;i<watchObjNames.length;i++) {
                        scope.$watch(watchObjNames[i], function () {
                            $("body").animate({scrollTop: element.offset().top}, "slow");
                        }, true);
                    }
                }
            }
        };
    }]);
