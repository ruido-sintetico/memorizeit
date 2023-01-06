/**
 * This module contains class Forms and its methods
 * @module form.js
 * @requires zepto or jQuery
 * @author Ivan A. Semenov
 */

/**
 * Constructor Form. It creates Form instance that allow to manipulate gotten fotm
 * @class
 * @param {mix} [selector] - any jQuery selector, html string, function
 * @return {cookie} Form instance
 */

function Forms(selector) {

    /**
     * @private
     */
    var self = this;
    this._elements = [];
    this._form = Zepto(selector);
    this._form.submit(function(e) {
        console.log("form dispatching...");
        return true;
    });

    // Finish form validation

    var last = Zepto(this._form[this._form.length - 1]).
    append("<input type='hidden' class='lastElement'>").find('.lastElement')

    for (var i = 0; i < last.length; ++i) {
        last[i].isValid = function() {
            console.log("valid");
            self._form.submit();
        };
    }

    /**
     * Add form elements to the array
     * @function addElements
     * @private
     * @param {object} item
     */
    function addElements(item) {
        self._elements.push(item);
        if (item.children.length > 0) {
            for (var i = 0; i < item.children.length; ++i) {
                self._validateElem(i, item.children[i]);
            }
        }
    }


    /**
     * Validate all elements of the form
     * @method validateElem
     * @private
     * @param {number} index
     * @param {object} item
     * @return {boolean}
     */

    this._validateElem = function(index, item) {
        addElements(item);
    }

}

/**
 * Add new element
 * @method addElement
 * @public
 * @param {mix} element - html string, DOM node, array of DOM node.
 * @return this
 */

Forms.prototype.addElement = function(elem) {
    if (elem) {
        this._form.find(".lastElement").before(elem);
    } else {
        new AppError("", "There is no elem arg", this);
    }
    return this;
}

/**
 * Remove element from form
 * @method removeElement
 * @public
 * @param {mix} element - selector, collection, element.
 * @return this
 */

Forms.prototype.removeElement = function(elem) {
    if (elem) {
        this._form.find(elem).remove();
    } else {
        new AppError("", "There is no elem arg", this);
    }
    return this;
}

/**
 * Insert form into element
 * @method insert
 * @public
 * @param {mix} elem - Selector, html string, collection, DOM nodes, function.
 * @return this
 */

Forms.prototype.insert = function(elem) {
    if (elem) {
        Zepto(elem).append(this._form);
    } else {
        new AppError("", "There is no elem arg", this);
    }
    return this;
}

/**
 * Remove form from element
 * @method remove
 * @public
 * @return this
 */

Forms.prototype.remove = function() {
    if (this._form.parent()) {
        this._form.remove(this._form);
    }
    return this;
}

/**
 * Validate form
 * @method validate
 * @public
 */

Forms.prototype.validate = function() {
    this._form.each(this._validateElem);
    for (var j = 0; j < this._elements.length; ++j) {
        if (this._elements[j].isValid) {
            if (!this._elements[j].isValid()) {
                this._elements = [];
            }
        }
    }
}


/**
 * Get element from form
 * @method getElement
 * @public
 * @param {mix} [element] - selector, collection, element.
 * @return {object} element
 */

Forms.prototype.getElement = function(elem) {
    if (elem) return this._form.find(elem)
    else return this._form.find("*");
}

/**
 * Attach hendler to form
 * @method on
 * @public
 * @param {string} event
 * @param {function} handler
 * @return this
 */

Forms.prototype.on = function(event, handler) {
    this._form.on(event, handler);
    return this;
}
