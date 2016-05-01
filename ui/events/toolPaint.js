"use strict";

(function() {

var sampleSave,
	px = 0;

ui.tool.paint = {
	mousedown: function( e, sample ) {
		sampleSave = sample;
		px = e.pageX;
	},
	mouseup: function() {
		sampleSave = null;
	},
	mousemove: function( e ) {
		if ( sampleSave ) {
			ui.samplesMoveX( sampleSave, ( e.pageX - px ) / ui.gridEm );
			px = e.pageX;
		}
	}
};

})();
