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
		ui.gridcontent.left( ui.trackLinesLeft + ui.px_xRel );
		ui.grid.scrollTop( ui.grid._scrollTop - ui.px_yRel );
		ui.timeline.update();
		ui.tracksBg.update();
	}
};
