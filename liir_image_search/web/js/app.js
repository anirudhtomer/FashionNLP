var susana = angular.module('susana', ['ngRoute', 'ngCookies']);

susana.config(['$routeProvider',
    function ($routeProvider) {

        $routeProvider
            .when("/demopage", {
                templateUrl: "html/demopage.html",
                controller: 'DemoPageCtrl'
            })

            .otherwise({
                redirectTo: "/demopage"
            });
    }
]);

//Constants
const SEARCH_BOX_CALLBACK_MAP = 'searchboxCallbackMap';