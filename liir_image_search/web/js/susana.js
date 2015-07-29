var susana = angular.module('susana', ['ngRoute', 'ngCookies']);

susana.config(['$routeProvider',
    function ($routeProvider) {

        $routeProvider
            .when("/indexpage", {
                templateUrl: "html/indexpage.html",
                controller: 'IndexCtrl'
            })

            .otherwise({
                redirectTo: "/indexpage"
            });
    }
]);

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
