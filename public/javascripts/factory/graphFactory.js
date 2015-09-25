angular.module("analoc")
    .factory("graphFactory", ["$http", function ($http) {
//get data by date

        var factory = {};

        factory.getData = function (from, to, next) {
            $http({
                method: 'get',
                url: '/data',
                params: {
                    fromDate: from,
                    toDate: to                }
            }).success(function (data, status, headers, config) {
                next(null, data);
            }).error(function (data, status, headers, config) {
                next(new Error("Can't fetch data"));
            });
        };

        return factory;
    }]);