/**
 * @file Public files settings
 */

// Dependencies
const Confidence = require("confidence");

const settings = {

	// Public files settings goes here
	$meta: "This file stores the public files settings.",
	projectName: "server",
	location: {
		$filter: "env",
		production: {
			pages: "/app/public/pages",
			scripts: "/app/public/scripts",
			styles: "/app/public/styles",
			images: "/app/public/images",
			favicon: "/app/public/favicon.ico",
			views: "/app/public/views"
		},
		development: {
			pages: "/../assets/pages",
			scripts: "/../assets/scripts",
			styles: "/../assets/styles",
			images: "/../assets/images",
			favicon: "/../assets/favicon.ico",
			views: "/../assets/views"
		},
		test: {

		},
		$default: {
			pages: "/app/public/pages",
			scripts: "/app/public/scripts",
			styles: "/app/public/styles",
			images: "/app/public/images",
			favicon: "app/public/favicon.ico",
			views: "/app/public/views"
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
