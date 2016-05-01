"use strict";

ui.tool.delete = {
	mouseup: function() {},
	mousedown: function( e, sample ) {
		ui.sampleDelete( sample );
	},
	mousemove: function( e, sample ) {
		ui.sampleDelete( sample );
	}
};
