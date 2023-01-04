/**
 * @file This file contains user model.
 */

"use strict";

// Dependencies
const mongoose = require("mongoose");
const passportLocal = require("passport-local-mongoose");
const isEmail = require("isemail");
const isPassword = require("./ispassword.js")

/**
 * Constructor creates new mongoose model that describes the users account.
 * @class
 */

const User = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		validate: {
			validator: (v) => {
				return isEmail.validate(v);
			}, 
			message: "{VALUE} is not valid email"
		}
	},
	dateOfReg: {
		type: Date,
		required: false
	}
})

User.plugin(passportLocal, {usernameField: "username", passwordValidator: isPassword});

module.exports = mongoose.model("User", User);