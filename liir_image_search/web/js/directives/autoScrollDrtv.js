susana.directive('autoScrollOn',
    [function () {
        return {
            restrict: "A", //The directive can only be used as an attribute
            scope:{},
            link: function (scope, element, attrs) {
                if (angular.isDefined(attrs.autoScrollOn)) {
                    var watchObjNames = attrs.autoScrollOn.split(",");
                    for(var i=0;i<watchObjNames.length;i++) {
                        scope.$watch("$parent." + watchObjNames[i], function (newval, oldval) {
                            if(newval!==oldval) {
                                $("body, html").animate({scrollTop: element.offset().top}, "slow");
                            }
                        }, true);
                    }
                }
            }
        };
    }]);
