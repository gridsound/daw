"use strict";

ui.tool.hand = {
	start: function() {
		ui.cursor( "grid", "grab" );
	},
	end: function() {
		ui.cursor( "grid", null );
	},
	mousedown: function() {
		ui.cursor( "app", "grabbing" );
	},
	mouseup: function() {
		ui.cursor( "app", null );
	},
	mousemove: function( e, sample, mx, my ) {
		ui.setTrackLinesLeft( ui.trackLinesLeft + mx );
		ui.setGridScrollTop( ui.gridScrollTop - my );
		ui.updateTimeline();
		ui.updateTrackLinesBg();
	}
};
