susana.filter(
    'UnderscoreFilter', [function () {
        return function (input) {
            return input.replace(/_/g, " ");
        };
    }]);

susana.filter(
    'NAFilter', [function () {

        return function (input) {
            if (angular.isString(input)) {
                if (input.trim().length === 0) {
                    return "Not Available";
                } else {
                    return input;
                }
            }
        };
    }]);

susana.filter(
    'RandomFilter', [function () {

        var count = 0;
        return function (input) {
            return input + "   " + count++;
        };
    }]);
