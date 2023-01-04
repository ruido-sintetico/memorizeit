/**
 * @file This file contains logic to check the password.
 */

"use strict";

// Dependencies

module.exports = (v, done) => {

	const edge = /[0-9a-zA-Z]/;
	const middle = /[^\w-]/;
	const length = v.length;
	const last = v.charAt[length - 1];
	const first = v.charAt[0];

	if (typeof v !== 'string') done(new TypeError("v is not string."));

	if (edge.test(last) || edge.test(first)) {
		v = v.slice(1, -1);
		if (!middle.test(v)) return done();
	} else return done(new PasswordValidationError("Invalid password."));

}
/**
 
 password: {
		type: String,
		required: true,
		maxlength: 15,
		minlength: 5,
		validate: {
			validator: (v) => {
				return isPassword(v);
			}, 
			message: "{VALUE} is not valid email"
		}
	},
 
 */