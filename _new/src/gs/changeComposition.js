"use strict";

gs.changeComposition = function( obj ) {
	var k,
		cmp = gs.currCmp,
		bPM = obj.beatsPerMeasure,
		sPB = obj.stepsPerBeat;

	if ( obj.tracks ) {
		ui.mainGridSamples.change( obj );
	}
	if ( obj.blocks ) {
		// ...
	}
	if ( obj.bpm ) {
		// gswa...()
		ui.controls.bpm( obj.bpm );
	}
	if ( bPM || sPB ) {
		bPM = bPM || cmp.beatsPerMeasure;
		sPB = sPB || cmp.stepsPerBeat;
		ui.mainGridSamples.timeSignature( bPM, sPB );
		ui.keysGridSamples.timeSignature( bPM, sPB );
	}
	common.assignDeep( cmp, obj );
	if ( obj.name != null || obj.bpm ) {
		ui.cmps.update( cmp.id, cmp );
	}
};
