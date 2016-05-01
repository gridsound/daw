"use strict";

ui.tool.delete = {
	mouseup: function() {},
	mousedown: function( e ) {
		ui.sampleDelete( e.target.uisample );
	},
	mousemove: function( e ) {
		ui.sampleDelete( e.target.uisample );
	}
};
