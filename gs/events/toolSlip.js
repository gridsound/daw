"use strict";

( function() {

var sampleSave;

ui.tool.slip = {
	mousedown: function( e ) {
		sampleSave = e.target.gsSample;
	},
	mouseup: function() {
		if ( sampleSave ) {
			gs.samplesForEach( sampleSave, function( s ) {
				wa.composition.update( s.wsample, "mv" );
			} );
		}
		sampleSave = null;
	},
	mousemove: function( e, secRel ) {
		if ( sampleSave ) {
			return gs.samplesSlip( sampleSave, secRel );
		}
	}
};

} )();
