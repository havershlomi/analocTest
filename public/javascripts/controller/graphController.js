angular.module("analoc")
    .controller("graphController", ["$scope", "graphFactory",
        function ($scope, graphFactory) {

            $scope.ctx = document.getElementById("myChart").getContext("2d");

            $scope.$watch('myDateRange', function (newVal, oldVal) {
                if (!oldVal)return;
                if (newVal !== oldVal) {
                    graphFactory.getData(newVal.startDate.toString(),
                        newVal.endDate.toString(),
                        function (err, data) {
                            if (err) return console.log(err);

                            $scope.setHourlyGraphData(data);
                        });
                }
            }, true);


            $scope.setHourlyGraph = function () {

                var data = {
                    labels: ["01:00", "02:00", "03:00", "04:00", "05:00",
                        "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
                        "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
                        "20:00", "21:00", "22:00", "23:00", "24:00"],
                    datasets: [
                        {
                            label: "In Store Devices",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        },
                        {
                            label: "Out Store Devices",
                            fillColor: "rgba(151,187,205,0.2)",
                            strokeColor: "rgba(151,187,205,1)",
                            pointColor: "rgba(151,187,205,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,1)",
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        }
                    ]
                };
                $scope.chart = new Chart($scope.ctx).Line(data, {})
            };
           
            $scope.setHourlyGraph();
            $scope.setHourlyGraphData = function (rawData) {
                for (var i = 0; i < 24; i++) {
                    $scope.chart["datasets"][0].points[i].value = rawData["hours"][i ]["in"];
                    $scope.chart["datasets"][1].points[i].value = rawData["hours"][i]["out"];
                }
                $scope.chart.update();

            }


        }]);