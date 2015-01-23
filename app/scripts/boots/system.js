(function() {

    /**
     * base inherits.
     * @param  {function} C    subclass constructor.
     * @param  {function} P superclass constructor.
     * @return {function} return subclass
     */
    window.inherit = (function() {
    	// proxy.
        var F = function() {};
        return function(C, P) {
            F.prototype = P.prototype;
            C.prototype = new F();
            C.uber = P.prototype;
            C.prototype.constructor = C;
        };
    }());
})();
