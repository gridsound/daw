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
	mousemove: function( e ) {
		ui.setTrackLinesLeft( ui.trackLinesLeft + ui.px_xRel );
		ui.setGridScrollTop( ui.gridScrollTop - ui.px_yRel );
		ui.timeline.update();
		ui.updateTracksBg();
	}
};
