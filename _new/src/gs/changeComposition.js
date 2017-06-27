"use strict";

gs.changeComposition = function( obj ) {
	var cmp = gs.currCmp,
		bPM = obj.beatsPerMeasure,
		sPB = obj.stepsPerBeat;

	if ( obj.data ) {
		// ...
		delete obj.data;
	}
	if ( obj.tracks ) {
		// ...
		delete obj.tracks;
	}
	if ( obj.blocks ) {
		// ...
		delete obj.blocks;
	}
	if ( obj.name ) {
		ui.cmpName( cmp, obj.name );
	}
	if ( obj.bpm ) {
		// gswa...()
		ui.controls.bpm( obj.bpm );
		ui.cmpBPM( cmp, obj.bpm );
	}
	if ( sPB ) {
		ui.mainGridSamples.timeSignature( bPM, sPB );
		ui.keysGridSamples.timeSignature( bPM, sPB );
	}
	Object.assign( cmp, obj );
};
