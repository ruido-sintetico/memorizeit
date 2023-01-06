/**
 * This module defines layout to working with words collection
 * @module words.js
 * @author Ivan A. Semenov
 */

// Dependencies

var mongoose = require("mongoose");

module.exports = (function() {
    var wordSchema = mongoose.Schema({
        name: String,
        value: String,
        dictId: String,
        date: Date,
        inArchive: Boolean,
        tests: Number,
        wrongTests: Number
    })

    // [Schema].methods and [Schema].static can be added here


    var Word = mongoose.model("Word", wordSchema);

    return Word;
})()
