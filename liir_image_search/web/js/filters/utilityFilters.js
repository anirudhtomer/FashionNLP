susana.filter(
    'UnderscoreFilter', [function(){
        return function(input){
            return input.replace(/_/g, " ");
        };
    }]);