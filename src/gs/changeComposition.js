"use strict";

gs.changeComposition = function( obj ) {
	var keysId,
		assetId,
		cmp = gs.currCmp,
		bPM = obj.beatsPerMeasure,
		sPB = obj.stepsPerBeat;

	common.assignDeep( cmp, obj );
	if ( obj.tracks ) {
		ui.mainGridSamples.change( obj );
	}
	for ( assetId in obj.assets ) {
		gs.updatePattern( assetId, obj.assets[ assetId ] );
	}
	for ( keysId in obj.keys ) {
		for ( assetId in cmp.assets ) {
			if ( cmp.assets[ assetId ].keys === keysId ) {
				gs.updatePatternContent( assetId );
				if ( assetId === cmp.patternOpened ) {
					ui.keysGridSamples.change( obj.keys[ keysId ] );
				}
				break;
			}
		}
	}
	if ( obj.bpm ) {
		// gswa...()
		ui.controls.bpm( obj.bpm );
	}
	if ( bPM || sPB ) {
		ui.mainGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
		ui.keysGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
	}
	if ( obj.name != null || obj.bpm ) {
		ui.cmps.update( cmp.id, cmp );
	}
};
