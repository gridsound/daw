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
		ui.setGridTop( ui.gridTop + my );
		ui.updateTimeline();
		ui.updateTrackLinesBg();
		ui.updateGridBoxShadow();
	}
};
