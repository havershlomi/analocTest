/**
 * Created by shlomi on 9/25/2015.
 */
var jsonFile = require("jsonfile");
var async = require("async");
var jsonDataPath = "./data/sample_data.json";
var cachePath = "./cache/";
var fs = require('fs');

exports.createCacheDir = function (dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        return true;
    }
    return false;
};

exports.isCacheNeeded = function (dir, dataSource) {
    if (exports.createCacheDir(cachePath))return true;
    var cacheStats = fs.statSync(dir);
    var dataStats = fs.statSync(dataSource);
    if (cacheStats.mtime < dataStats.mtime) return true;
    return false;
};

exports.cache = function (req, res, next) {
    if (!exports.isCacheNeeded(cachePath, jsonDataPath)) return next();

    async.waterfall([function (done) {
        jsonFile.readFile(jsonDataPath, function (err, obj) {
            if (err) done(err);
            done(null, obj)
        });
    }, function (obj, done) {
        var days = {};
        async.forEachOf(obj, function (val, key, callback) {
            var day = val['date'];
            days[day] = days[day] || {
                "hours": {

                },
                "daily": {
                    "in": [],
                    "out": []
                }
            };
            var mac = val["mac_address"], hour = val["hour"];
            days[day]["hours"][hour] = days[day]["hours"][hour] || { "in": [], "out": []};
            if (val["is_inside"] === "0") {//out
                if (days[day]["daily"]["out"].indexOf(mac) === -1) {
                    days[day]["daily"]["out"].push(mac);
                }

                if (days[day]["hours"][hour]["out"].indexOf(mac) === -1) {
                    days[day]["hours"][hour]["out"].push(mac);
                }
            } else {//in
                if (days[day]["daily"]["in"].indexOf(mac) === -1) {
                    days[day]["daily"]["in"].push(mac);
                }

                if (days[day]["hours"][hour]["in"].indexOf(mac) === -1) {
                    days[day]["hours"][hour]["in"].push(mac);
                }
            }

            callback();
        }, function (err) {
            if (err) done(err);
            done(null, days);
        });
    }, function (days, done) {

        async.forEachOf(days, function (val, key, done) {

            var day = {
                "hours": {

                },
                "daily": {
                    "in": val["daily"]["in"].length,
                    "out": val["daily"]["out"].length
                }
            };

            for (var i = 1; i < 24; i++) {
                day["hours"][i] = {
                    "in": val["hours"][i] ? val["hours"][i]["in"].length : 0,
                    "out": val["hours"][i] ? val["hours"][i]["out"].length : 0
                };
            }

            jsonFile.writeFile(cachePath + key + ".json", day, function (err) {
                if (err)done(err);
                done();
            })


        }, function (err) {
            if (err) done(err);
            done();
        });
    }], function (err) {
        if (err)return next(err);
    });


}
;




