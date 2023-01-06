/**
 * 
 */
module.exports = function(appState) {		//requieres lang property
    var vocabulary;
    var getTranslate;
    var iterateAppStatesValues;

    // Use default values (english)
    if (appState.lang == "en") vocabulary = {}
    // Use other lang
    else vocabulary = require("./" + appState.lang + ".json");

    /**
     * function getTranslate
     * Find translate
     * @param {string} phrase - Phrase needing to translate.
     * @param {object} vocabulary - Object to search phrases translate.
     * @return {string} phrase - Translated phrase.
     */

    getTranslate = function(phrase, vocabulary) {
		
        var translate = vocabulary[phrase];
        if (translate) return translate;
        return phrase;
        
    }

    /**
     * function iterateAppStatesValues
     * @param {object} appState - Object to iterate its property
     */

    iterateAppStatesValues = function(appState) {

        for (var ph in appState) {
            if (typeof appState[ph] == "object") iterateAppStatesValues(appState[ph]);
            appState[ph] = getTranslate(appState[ph], vocabulary)
        }
        
    }
    iterateAppStatesValues(appState);

    return appState;
}
