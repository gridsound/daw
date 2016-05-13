"use strict";

(function() {

var sampleSave;

ui.tool.slip = {
	mousedown: function( e, sample ) {
		sampleSave = sample;
	},
	mouseup: function() {
		if ( sampleSave ) {
			ui.samplesForEach( sampleSave, function( s ) {
				wa.composition.update( s.wsample, "mv" );
			});
		}
		sampleSave = null;
	},
	mousemove: function( e, sample, mx ) {
		if ( sampleSave ) {
			ui.samplesSlip( sampleSave, mx / ui.gridEm );
		}
	}
};

})();
