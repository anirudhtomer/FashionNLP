susana.directive('infiniteScroll',
    ['UtilService', function(UtilService){

        return {
            restrict: "A", //The directive can only be used as an attribute
            scope: {
                scrollReachedBottomCallback: "=scrollReachedBottomCallback"
            },
            link: function(scope, element, attrs){
                var padding = (angular.isDefined(attrs.padding) && angular.isNumber(attrs.padding)) ? parseInt(attrs.padding): parseInt(element.css('padding-top'), 10) + parseInt(element.css('padding-bottom'), 10);

                element.scroll(function(){
                    if(element[0].scrollHeight === (element.scrollTop() +  element.height() + padding)){//20px padding
                        if(angular.isFunction(scope.scrollReachedBottomCallback)) {
                            scope.scrollReachedBottomCallback();
                            UtilService.scopeApply(scope);
                        }
                    }
                });
            }
        };

        //This directive works only with padding "not given as percentage". you can specify padding as an attribute as well.
    }
    ]);