"use strict"
var mongoose = require('mongoose');
var YakSchema = mongoose.Schema({
    message: String,
});

YakSchema.statics.schools = function(callback) {
    this.distinct('school', callback);
};

YakSchema.statics.yaks = function(school, fields, limit, callback) {
    this.find(
        {
            'school': school,
            'numberOfLikes': {$lt:0}
        },
        fields,
        {
            limit: limit,
        },
        callback);
};

YakSchema.statics.wordCount = function(school, callback) {
    var mr = {};

    mr.query = {
        'school' : school,
        numberOfLikes: {$lt:0}
    };

    mr.map = function() {
        var yak = this.message;
        var punctuation = /[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g;
        var extraspaces = /\s{2,}/g;

        yak = yak.toLowerCase().replace(punctuation,'');
        yak = yak.replace(extraspaces, ' ');

        var words = yak.split(' ');
        words.forEach(function(w) {
            emit(w, 1);
        });
    };
    
    mr.reduce = function(key, values) {
        var count = 0;
        values.forEach(function(v) {
            count += v;
        });
        return count;
    };

    this.mapReduce(mr, callback);
};

exports.YakSchema = YakSchema;

