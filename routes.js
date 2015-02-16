"use strict"
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/yy');
var YakSchema = require('./models').YakSchema;
var yak = db.model('yaks', YakSchema);
var natural = require('natural');

exports.wordCount = wordCount;
exports.schools = schools;
exports.yaks = yaks;
exports.bySchoolCount = bySchoolCount;
exports.tfidf = tfidf;
exports.ngrams = ngrams;
exports.scatterplot = scatterplot;
exports.downvotePercentage = downvotePercentage;

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
    yak.yaks(school, null, 20, function(err, docs) {
        res.json(docs);
    });
}

function tfidf(req, res) {
    var tf =  new natural.TfIdf();
    yak.yaks(req.param('school'), 'message -_id', 400, function(err, docs) {
        //run tfidf on each individual yak
        var corpus = '';
        docs.forEach(function(d) {
            corpus += d.message;
        });
        tf.addDocument(corpus);
        var tfidf = tf.listTerms(0);
        res.json(tfidf);
    });
}

function ngrams(req, res) {
    var NGrams = natural.NGrams;
    var school = req.param('school');
    var length = parseInt(req.param('length'));
    yak.yaks(school, 'message -_id', 400, function(err, docs) {
        var corpus = '';

        // reduce all of the yaks into a single string
        docs.forEach(function(d){
            corpus += d.message;
        });
        var gram = NGrams.ngrams(corpus, length);
        var sentences = [];
        
        gram.forEach(function(d) {
            sentences.push(d.join(' '));
        });
        res.json(sentences);
    });
}

function bySchoolCount(req, res) {
    yak.bySchoolCount(function(err, docs) {
        res.json(docs);
    });
}

function scatterplot(req, res) {
    var school = req.param('school');
    var query = {
        school: school
    };
    var fields = 'numberOfLikes comments -_id';
    yak.customQuery(query, fields, 10000, function(err, docs) {
        res.json(docs);
    });
}

function downvotePercentage(req, res) {
     yak.downvotePercentage(function(err, docs) {
        res.json(docs);
     });
}