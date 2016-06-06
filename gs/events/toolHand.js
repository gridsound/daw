"use strict";

ui.tool.hand = {
	mousedown: function() {
		ui.jqBody.addClass( "cursor-move" );
	},
	mouseup: function() {
		ui.jqBody.removeClass( "cursor-move" );
	},
	mousemove: function( e, sample, mx, my ) {
		ui.setTrackLinesLeft( ui.trackLinesLeft + mx );
		ui.setGridScrollTop( ui.gridScrollTop - my );
		ui.updateTimeline();
		ui.updateTrackLinesBg();
	}
};
