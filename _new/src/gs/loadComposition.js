"use strict";

gs.loadComposition = function( cmp ) {
	var cmpOrig = gs.localStorage.get( cmp.id );

	gs.currCmp = cmp;
	gs.currCmpSaved = !!( cmp.savedAt && cmpOrig && cmpOrig.savedAt === cmp.savedAt );
	if ( cmp.savedAt == null || !cmpOrig ) {
		ui.cmps.push( cmp.id );
		ui.cmps.update( cmp.id, cmp );
	}
	ui.controls.currentTime( 0 );
	ui.controls.bpm( cmp.bpm );
	ui.mainGridSamples.empty();
	ui.mainGridSamples.change( cmp );
	ui.mainGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
	ui.keysGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
	ui.cmps.load( cmp.id );
	ui.cmps.saved( !gs.isCompositionNeedSave() );
};
