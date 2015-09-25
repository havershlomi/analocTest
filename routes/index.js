var express = require('express');
var cache = require('../lib/dataCache');
var utils = require('../lib/utils');
var dataCache = require('../lib/dataCache');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});


router.get('/data', dataCache.cache, function (req, res, next) {
    var fromData = new Date(req.query["fromDate"]),
        toData = new Date(req.query["toDate"]);

    if (toData.toString() === "Invalid Date" || fromData.toString() === "Invalid Date") {
        res.status = 404;
        res.send();
    }

    var dayDiff = Math.floor(Math.abs(toData.getTime() - fromData.getTime()) / (1000 * 3600 * 24));
    if (dayDiff === 0) {
        //hourly
        cache.getDate(utils.formatDate(fromData), function (err, data) {
            if (err && err.code === "ENOENT") {
                var data = {"hours": {}};
                for (var i = 0; i < 24; i++) {
                    data["hours"][i] = {"in": 0, "out": 0};
                }
            }
            return  res.send({"hours": data["hours"]});
        });

    } else {
        //daily
    }

});

module.exports = router;
