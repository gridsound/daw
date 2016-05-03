"use strict";

(function() {

var sampleSave;

ui.tool.paint = {
	mousedown: function( e, sample ) {
		sampleSave = sample;
	},
	mouseup: function() {
		if ( sampleSave ) {
			ui.samplesFixPosition( sampleSave );
			sampleSave = null;
		}
	},
	mousemove: function( e, sample, mx, my ) {
		if ( sampleSave ) {
			ui.samplesMoveX( sampleSave, mx / ui.gridEm );
		}
	}
};

})();
