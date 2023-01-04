/**
 * @file This file contains the tests to check the logic password validacy.
 */

"use strict";

// Dependencies
const isPassword = require("../libs/ispassword.js");
const assert = require("chai").assert;

const correctPasswords = [
	"test",
	"1test",
	"test1",
	"12345",
	"123456789012345",
	"test_12345",
	"12_test",
	"test-12",
	"12-test"
];
const incorrectPasswords = [
	"_test",
	"test_",
	"test@test",
	"!test",
	"test#",
	"-test",
	"test-",
	"test",
	"toomanysymbolsin",
	1
];

describe("Tests correct passwords...", () => {

	correctPasswords.forEach((elem) => {

		it("Should return true.", () => {

			assert.isTrue(isPassword(elem), "Checking correct password(" + elem + ") does not return true.")

		})

	})

})

describe("Tests incorrect passwords...", () => {
	
	correctPasswords.forEach((elem) => {

		it("Should return false.", () => {

			assert.isTrue(isPassword(elem), "Checking incorrect password(" + elem + ") does not return false.")

		})

	})
})
