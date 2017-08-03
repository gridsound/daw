"use strict";

gs.loadComposition = function( cmp ) {
	var id, cmpOrig = gs.localStorage.get( cmp.id );

	gs.currCmp = cmp;
	gs.currCmpSaved = !!( cmp.savedAt && cmpOrig && cmpOrig.savedAt === cmp.savedAt );
	gs.patternIdAbs = 0;
	if ( cmp.savedAt == null || !cmpOrig ) {
		ui.cmps.push( cmp.id );
		ui.cmps.update( cmp.id, cmp );
	}
	for ( id in cmp.patterns ) {
		gs.addPattern( id, cmp.patterns[ id ] );
		gs.updatePatternContent( id );
	}
	ui.controls.currentTime( 0 );
	ui.controls.bpm( cmp.bpm );
	ui.mainGridSamples.empty();
	ui.mainGridSamples.change( cmp );
	ui.mainGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
	ui.keysGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
	ui.cmps.load( cmp.id );
	ui.cmps.saved( !gs.isCompositionNeedSave() );
	if ( cmp.patternOpened ) {
		gs.openPattern( cmp.patternOpened );
	}
};
