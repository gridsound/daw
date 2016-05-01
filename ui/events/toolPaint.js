"use strict";

(function() {

var px = 0;

ui.tool.paint = {
	mouseup: function() {},
	mousedown: function( e ) {
		px = e.pageX;
	},
	mousemove: function( e ) {
		if ( e.target.uisample ) {
			ui.samplesMoveX( e.target.uisample, ( e.pageX - px ) / ui.gridEm );
			px = e.pageX;
		}
	}
};

})();
