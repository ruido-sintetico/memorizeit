/*
 * @file Server settings
 */

// Dependencies
const Confidence = require("confidence");

const settings = {

	// Server settings goes here
	$meta: "This file configures the server.",
	projectName: "memorizeit",
	salt: "memorizeit-app-salt",
	env: {
		$filter: "env",
		development: {
			host: "localhost",
			port: "4000"
		},
		production: {
			//host: /*IPADDRESS VAR*/,
			//port: /*PORT VAR*/
		},
		test: {
			host: "localhost",
			port: "1000"				// Change for testing
		},
		$default: {
			host: "127.0.0.1",
			port: "40000"
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
