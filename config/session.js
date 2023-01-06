/*
 * @file Session settings 
 */

// Dependencies
const Confidence = require("confidence");

const settings = {
	
	// Server settings goes here
	$meta: "This file configures the sessions.",
	projectName: "memorizeit",
	secret: "memorizeit-sessions-secret",
	name: "sessionID",
	settings: {
		$filter: "env",
		development: {
			resave: false,
			rolling: true,
			saveUninitialized: false
		},
		production: {
			resave: false,
			rolling: true,
			saveUninitialized: false
		},
		test: {
		
		},
		$default: {
			
		}
	},
	cookie: {
		$filter: "env",
		development: {
			path: "/",
			httpOnly: true,
			secure: false,
			maxAge: 60000
		},
		production: {
			path: "/",
			httpOnly: true,
			secure: false,
			maxAge: 60000
		},
		test: {
		
		},
		$default: {
			
		}
	}
};

const store = new Confidence.Store(settings);

exports.get = (key, criteria) => {
	return store.get(key, criteria);
};

exports.meta = (key, criteria) => {
	return store.meta(key, criteria);
};