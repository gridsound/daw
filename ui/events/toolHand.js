"use strict";

(function() {

var px = 0, py = 0;

ui.tool.hand = {
	mousedown: function( e ) {
		px = e.pageX;
		py = e.pageY;
	},
	mouseup: function() {
		ui.jqBody.removeClass( "cursor-move" );
	},
	mousemove: function( e ) {
		ui.setTrackLinesLeft( ui.trackLinesLeft + ( e.pageX - px ) );
		ui.setGridTop( ui.gridTop + ( e.pageY - py ) );
		ui.updateTimeline();
		ui.updateGridBoxShadow();
		px = e.pageX;
		py = e.pageY;
	}
};

})();
