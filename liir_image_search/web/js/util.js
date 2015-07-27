susana.filter(
    'UnderscoreFilter', [function(){
        return function(input){
            return input.replace(/_/g, " ");
        };
    }]);

susana.factory(
    'UtilService',
    [function(){
        return{
            scopeApply: safeApply,
            traverseObject: function(dataObj, traversePatternArray){
                return traversePatternArray.reduce(traverseObject, dataObj);
            },
            getAttributeObject: function(attrValue, parentObj){
                var attrSplit = attrValue.split(".");

                var attrObj = parentObj[attrSplit[0]];

                if(attrSplit.length > 0){
                    attrSplit.splice(0, 1);
                    attrObj = this.traverseObject(attrObj, attrSplit);
                }
                return attrObj;
            }
        };

        function traverseObject(obj, index){
            if(angular.isUndefined(obj)){
                return;
            }

            return obj[index];
        }

        function safeApply(scope, fn){
            if(!scope.$$phase && !scope.$root.$$phase){
                if(angular.isDefined(fn)){
                    scope.$apply(fn);
                }
                else{
                    scope.$apply();
                }
            }
            else{
                if(angular.isDefined(fn)){
                    fn();
                }
            }
        }
    }]
);