"use strict";

(function() {

var sampleSave,
	px = 0;

ui.tool.slip = {
	mousedown: function( e, sample ) {
		sampleSave = sample;
		px = e.pageX;
	},
	mouseup: function() {
		sampleSave = null;
	},
	mousemove: function( e ) {
		if ( sampleSave ) {
			ui.samplesSlip( sampleSave, ( e.pageX - px ) / ui.gridEm );
			px = e.pageX;
		}
	}
};

})();
