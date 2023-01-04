/**
 * @file Tests user.js
 */

"use strict";

// Dependencies
const User = require("../libs/user.js");
const dbConfig = require("../config/db.js").get("/env", "debug");
const chai = require("chai");
const mongoose = require("mongoose");
const db = mongoose.connect(`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.db}`)

const email = "test@test.test";
const now = new Date();
const password = "test1";

describe("User...", () => {
	
	before((done) => {

		User.remove({}, (err) => {

			if (err) throw err;
			done();

		})

	})
	
	describe("Tests without email...", () => {

		it("Validation should fail.", (done) => {

			User.create({dateOfReg: now, password: password}, (err, user) => {

				if (err) return done();
				throw new Error("Validation have not been failed.");

			})

		})

	})
	
	describe("Tests without dateOfReg...", () => {

		it("Validation should fail.", (done) => {

			User.create({email: email, password: password}, (err, user) => {

				if (err) return done();
				throw new Error("Validation have not been failed.");

			})

		})

	})
	
	describe("Tests without passwords...", () => {

		it("Validation should fail.", (done) => {

			User.create({email: email, dateOfReg: now}, (err, user) => {

				if (err) return done();
				throw new Error("Validation have not been failed.");

			})

		})

	})

	describe("Tests correct model...", () => {

		it("Validation should not fail.", (done) => {
			
			User.create({email: email, dateOfReg: now, password: password}, (err, user) => {

				if (err) throw err;
				done();

			})

		})

	})

})