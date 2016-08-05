"use strict";

(function() {

var sampleSave,
	oldOffset;

ui.tool.slip = {
	mousedown: function( e, sample ) {
		sampleSave = sample;
		if ( sample ) {
			oldOffset = sample.wsample.offset;
		}
	},
	mouseup: function() {
		if ( sampleSave ) {
			if ( oldOffset != sampleSave.wsample.offset )
				gs.history.push( {
					action: {
						func: gs.history.slip,
						sample: sampleSave,
						offsetDiff: ( oldOffset - sampleSave.wsample.offset ) * ui.BPMem * ui.gridEm
					},
					undo: {
						func: gs.history.undoSlip,
						sample: sampleSave,
						offsetDiff: ( sampleSave.wsample.offset - oldOffset ) * ui.BPMem * ui.gridEm
					}
				} );
				gs.samplesForEach( sampleSave, function( s ) {
					wa.composition.update( s.wsample, "mv" );
				});
			}
		sampleSave = null;
	},
	mousemove: function( e, sample, mx ) {
		if ( sampleSave ) {
			gs.samplesSlip( sampleSave, mx / ui.gridEm );
		}
	}
};

})();
