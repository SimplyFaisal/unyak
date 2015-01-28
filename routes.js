"use strict"
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/yy');
var YakSchema = require('./models').YakSchema;
var yak = db.model('yaks', YakSchema);

exports.wordCount = wordCount;
exports.schools = schools;
exports.yaks = yaks;

function wordCount(req, res) {
    var school = req.params.school;

    yak.wordCount(school, function(err, docs) {
        res.json(docs);
    });
}

function schools(req, res) {
    yak.schools(function (err, docs) {
        res.json(docs.sort());
    });
}

function yaks(req, res) {
    var school = req.param('school');
    yak.yaks(school, function(err, docs) {
        res.json(docs);
    });
}