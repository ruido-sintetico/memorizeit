/**
 * @file Database settings
 */

// Dependencies
const Confidence = require("confidence");

const settings = {
	
	// Db settings goes here
	$meta: "This file stores the database settings.",
	projectName: "memorizeit",
	env: {
		$filter: "env",
		development: {
			host: "localhost",
			port: "27017",
			db: 'memorizeit'
		},
		production: {
			host: "real_site",			// Change to environment variables
			port: "9090",				// before production
			user: "admin",
			password: "123456",
			db: "memorizeit",
		},
		debug: {
			host: "localhost",
			port: "27017",
			db: "memorizeit"			// Change for testing
		},
		$default: {
			host: "localhost",
			port: "27017",
			db: 'mem'
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