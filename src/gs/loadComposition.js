"use strict";

gs.loadComposition = function( cmp ) {
	return gs.unloadComposition().then( function() {
		var cmpOrig = gs.localStorage.get( cmp.id );

		common.smallId_i = gs.getMaxCompositionInnerId( cmp ) + 1;
		gs.handleOldComposition( cmp );
		gs.undoredo.init( cmp );
		gs.currCmp = cmp;
		gs.currCmpSaved = !!( cmp.savedAt && cmpOrig && cmpOrig.savedAt === cmp.savedAt );
		if ( !gs.currCmpSaved ) {
			gs.actionSaved = -1;
		}
		if ( cmp.savedAt == null || !cmpOrig ) {
			ui.cmps.push( cmp.id );
			ui.cmps.update( cmp.id, cmp );
		}
		Object.entries( cmp.synths ).forEach( ( [ id, syn ] ) => {
			wa.synths.create( id, syn );
			ui.synths.create( id, syn );
		} );
		Object.entries( cmp.patterns ).forEach( ( [ id, pat ] ) => {
			ui.patterns.create( id, pat );
			ui.patterns.updateContent( id );
		} );
		wa.controls.setBPM( cmp.bpm );
		wa.maingrid.assignChange( cmp.blocks );
		ui.controls.currentTime( "main", 0 );
		ui.controls.currentTime( "pattern", 0 );
		ui.controls.bpm( cmp.bpm );
		ui.mainGrid.empty();
		ui.mainGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
		ui.pattern.pianoroll.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
		common.assignDeep( ui.mainGridSamples.data, cmp );
		ui.cmps.load( cmp.id );
		ui.cmps.saved( !gs.isCompositionNeedSave() );
		if ( cmp.patternOpened ) {
			gs.openPattern( cmp.patternOpened );
		}
		if ( cmp.synthOpened ) {
			gs.openSynth( cmp.synthOpened );
			ui.synths.show( cmp.synthOpened, true );
		}
		gs.controls.focusOn( "main" );
	}, console.log.bind( console ) );
};
