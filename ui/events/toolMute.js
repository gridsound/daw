"use strict";

ui.tool.mute = {
	mouseup: function() {},
	mousedown: function( e, sample ) {
		if ( sample ) {
			sample.mute();
		}
	},
	mousemove: function( e, sample ) {
		if ( sample ) {
			sample.mute();
		}
	}
};
