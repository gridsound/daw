"use strict";

ui.tool.hand = {
	start: function() {
		common.cursor( "grid", "grab" );
	},
	end: function() {
		common.cursor( "grid", null );
	},
	mousedown: function() {
		common.cursor( "app", "grabbing" );
	},
	mouseup: function() {
		common.cursor( "app", null );
	},
	mousemove: function( e ) {
		ui.gridcontent.left( ui.trackLinesLeft + ui.px_xRel );
		ui.grid.scrollTop( ui.grid._scrollTop - ui.px_yRel );
		ui.timeline.update();
		ui.tracksBg.update();
	}
};
