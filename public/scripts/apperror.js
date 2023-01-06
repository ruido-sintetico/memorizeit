 /**
     * This module define app-level error handler
     * @module apperror.js
     * @author Ivan A. Semenov
     */

function AppError(message, consoleMes, context, className) {

    var isHighlighted = function(){
        return $("#main-wrapper").find("#highlighted").length;
    }

    function getClass(classN) {
        if (classN == undefined) return "error"
        else if (typeof classN === "string") return classN
        else console.log("AppError: parameter color must be a string");
    };

    if(message) {
        if ( isHighlighted() === 0 ) {
            $("#content").before("<div id='highlighted'></div>");
        }
        $("#highlighted").append("<p class='" + getClass(className) + "'>" + message + "</p>");
    }
    // Attach handlers to highlighted
    $("#highlighted").click(function() {
        $("#highlighted").remove();
    })

	if (consoleMes != undefined) {
		console.log(context +": " + consoleMes);
	}

}
