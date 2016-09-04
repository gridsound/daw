"use strict";

ui.tool.delete = {
	mousedown: function( e ) {
		gs.sampleDelete( e.target.gsSample );
	},
	mousemove: function( e ) {
		gs.sampleDelete( e.target.gsSample );
	}
};
