"use strict";

(function() {

var sampleSave;

ui.tool.paint = {
	mousedown: function( e, sample ) {
		sampleSave = sample;
	},
	mouseup: function() {
		sampleSave = null;
	},
	mousemove: function( e, sample, mx, my ) {
		if ( sampleSave ) {
			ui.samplesMoveX( sampleSave, mx / ui.gridEm );
		}
	}
};

})();
