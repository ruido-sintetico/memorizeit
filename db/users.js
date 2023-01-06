/**
 * This module defines layout to working with users collection
 * @module users.js
 * @author Ivan A. Semenov
 */

// Dependencies

var mongoose = require("mongoose");

module.exports = (function() {
    var userSchema = mongoose.Schema({
        name: String,
        password: String,
        email: String,
        date: Date
    })

    // [Schema].methods and [Schema].static can be added here


    var User = mongoose.model("User", userSchema);

    return User;
})()
