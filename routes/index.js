var express = require('express');
var jsonData = require('../data/sample_data.json');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});


router.get('/data', function (req, res, next) {
    var fromData = req.query["fromData"],
    toData = req.query["toData"];

var a =jsonData;

    if(toData === fromData){
        //hourly


    }else{
        //daily
    }
});

module.exports = router;
