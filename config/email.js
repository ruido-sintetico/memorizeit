/**
 * @file Nodemailer settings
 */

// Dependencies
const Confidence = require("confidence");

const settings = {
	
	// Public files settings goes here
	$meta: "This file stores the nodemailer settings.",
	projectName: "server",
	service: {
		$filter: "service",
		Gmail: {
			user: 'memorizeit.app@gmail.com',
			clientId: "386558835383-srv6jh64a65l0ada5fl8mg64edth75rd",
			clientSecret: "f4vlBltSD_NYKD9CFcG6emZI",
			refreshToken: "1/j-yiE4ooEfPk2fsYWyZM_RVA5BHabc9yqPk4HWMe_Aw",
			accessToken: "ya29.cAL9GPP5pk4U7EL5V9aBCdbteKTc4qMokdDHUTt89olPKURdGsOf0YBok9F_7wjaSyhr"
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