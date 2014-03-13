Space.App = (function() {
    "use strict";

	return Tendon.Composer.extend({
		template: Template.get("application"),
		
	    layout: {
	    },

	    children: {
	    },

	    onRender: function() {
	    	this.ui.window = $(window);
	    	this.ui.body = $("body");
	    },

	    onUnknownRoute: function(routes) {
	    	// console.log("unknown route")
	    }
	});
})();