'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    name: String,
    creator: String,
    options: [{
       id: Number,
       name: String,
       votes: Number
    }]
});

module.exports = mongoose.model('Poll', Poll);
