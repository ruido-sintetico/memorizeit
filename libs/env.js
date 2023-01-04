/**
 * @file This module just return the server environment
 * @author Ivan A.Semenov<ivanse@yandex.ru>
 */

module.exports = function getEnv() {
	return process.env.NODE_ENV || "development";
}
