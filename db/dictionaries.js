/**
 * This module defines layout to working with dictionaries collection
 * @module dictionaries.js
 * @author Ivan A. Semenov
 */

// Dependencies

var mongoose = require("mongoose");

module.exports = (function() {
    var dictSchema = new mongoose.Schema({
        name: String,
        description: String,
        user: String,
        date: Date,
        inArchive: Boolean,
        tests: Number,
        wrongTests: Number
    })

    // [Schema].methods and [Schema].static can be added here

    var Dict = mongoose.model("Dict", dictSchema);

    return Dict;
})()
