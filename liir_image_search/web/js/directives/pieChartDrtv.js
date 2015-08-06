susana.directive('pieChart',
    ['UtilService', function (UtilService) {

        var count = 0;

        function createNewId() {
            return "PieChart" + count++;
        }

        return {
            restrict: "A", //The directive can only be used as an attribute
            scope: {
                pieChartData: "=",
                imageId: "="
            },
            link: function (scope, element, attrs) {
                var pieChartId = createNewId();
                element.attr("id", pieChartId);

                var chart = AmCharts.makeChart(pieChartId, {
                    type: "pie",
                    theme: "light",
                    dataProvider: scope.pieChartData,
                    valueField: "score",
                    titleField: "word",
                    labelsEnabled: true,
                    innerRadius: "50%",
                    responsive: {enabled: true},
                    balloonText: "[[title]]: [[percents]]%"
                });

                chart.addListener("drawn", function () {
                    element.find('a[href="http://www.amcharts.com/javascript-charts/"]').remove();
                });

                element.find('a[href="http://www.amcharts.com/javascript-charts/"]').remove();

                //If image Id changes rerender the graph
                scope.$watch("imageId", function(newval, oldval){
                    if(newval!==oldval) {
                        chart.dataProvider = scope.pieChartData;
                        chart.validateData();
                    }
                });
            }
        };
    }]);
