"use strict";

ui.tool.mute = {
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
