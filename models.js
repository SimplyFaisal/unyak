"use strict"
var mongoose = require('mongoose');
var YakSchema = mongoose.Schema({
    message: String,
    school: String,
    numberOfLikes: Number,
    comments: Number
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

YakSchema.statics.customQuery = function(query, fields, limit, callback) {
    this.find(
        query,
        fields,
        {
            limit: limit,
        },
        callback);
};

YakSchema.statics.bySchoolCount = function(callback) {
    this.aggregate([
        {$group: {
            _id:'$school',
            count: {$sum:1}
            }
        },
        {$sort: {count:-1}}
        ], callback);
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

YakSchema.statics.downvotePercentage = function(callback) {
   this.aggregate([
        {
            $group:{
                _id:'$school', 
                total:{$sum:1},
                downvoted:{
                    $sum:{
                        $cond: { if: { $lt: [ '$numberOfLikes', 0 ] }, then: 1, else: 0 }
                    }
                },
            }
        },
        {
            $project: {
                percentDownvoted: {$divide: ['$downvoted', '$total']}
            }
        },
        {
            $sort: {
                percentDownvoted: -1
            }
        }
    ], callback);
};

exports.YakSchema = YakSchema;

