"use strict";

ui.tool.mute = {
	mouseup: function() {},
	mousedown: function( e ) {
		if ( e.target.uisample ) {
			e.target.uisample.mute();
		}
	},
	mousemove: function( e ) {
		if ( e.target.uisample ) {
			e.target.uisample.mute();
		}
	}
};
