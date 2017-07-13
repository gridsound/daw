"use strict";

gs.changeComposition = function( obj ) {
	var k,
		cmp = gs.currCmp,
		bPM = obj.beatsPerMeasure,
		sPB = obj.stepsPerBeat;

	if ( obj.data ) {
		// ...
	}
	if ( obj.tracks ) {
		for ( k in obj.tracks ) {
			Object.assign( cmp.tracks[ k ], obj.tracks[ k ] );
		}
		ui.mainGridSamples.change( obj );
	}
	if ( obj.blocks ) {
		// ...
	}
	if ( obj.bpm ) {
		// gswa...()
		ui.controls.bpm( obj.bpm );
	}
	if ( sPB ) {
		cmp.beatsPerMeasure = obj.beatsPerMeasure,
		cmp.stepsPerBeat = obj.stepsPerBeat;
		ui.mainGridSamples.timeSignature( bPM, sPB );
		ui.keysGridSamples.timeSignature( bPM, sPB );
	}
	if ( obj.name != null || obj.bpm ) {
		if ( obj.bpm ) { cmp.bpm = obj.bpm; }
		if ( obj.name ) { cmp.name = obj.name; }
		ui.cmps.update( cmp.id, cmp );
	}
};
