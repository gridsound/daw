"use strict";

(function() {

var px = 0;

ui.tool.slip = {
	mouseup: function() {},
	mousedown: function( e ) {
		px = e.pageX;
	},
	mousemove: function( e ) {
		if ( e.target.uisample ) {
			ui.samplesSlip( e.target.uisample, ( e.pageX - px ) / ui.gridEm );
			px = e.pageX;
		}
	}
};

})();
