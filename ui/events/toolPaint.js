"use strict";

(function() {

var sampleSave;

ui.tool.paint = {
	mousedown: function( e, sample ) {
		sampleSave = sample;
	},
	mouseup: function() {
		if ( sampleSave ) {
			if ( ui.isMagnetized ) {
				if ( sampleSave.selected ) {
					ui.selectedSamples.forEach( function( s ) {
						s.xem = s.xemMagnet;
					});
				} else {
					sampleSave.xem = sampleSave.xemMagnet;
				}
			}
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
