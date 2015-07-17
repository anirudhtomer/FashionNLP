function readJson() {
    $.getJSON("../json/img2txt.json", function (data) {
        /*data.items[0].folder.split("dress_attributes/data")[1]*/
        console.log(data);
        for (i = 0; i < data.items.length; i++) {
            $('body').prepend('<img src="..' + data.items[i].folder.split("dress_attributes/data")[1] + data.items[i].img_filename + '"/>');
        }
    });
}

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
