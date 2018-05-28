"use strict";

gs.changeComposition = obj => {
	const cmp = gs.currCmp,
		currDur = cmp.duration;

	console.log( "changeComposition", obj );
	gs.currCmpSaved = gs.undoredo.getCurrentAction() === gs.actionSaved;
	ui.cmps.saved( !gs.isCompositionNeedSave() );
	// les blocks ne sont pas update par gsuiGridSamples mais dune maniere assez sale...
	// commoncons par rewrite gsuiTrackList et gsuiTrack
	if ( obj.blocks ) {
		wa.maingrid.assignChange( obj.blocks );
		cmp.duration = wa.maingrid.scheduler.duration;
		// lg(cmp.duration, Object.values( gs.currCmp.blocks )[ 0 ].duration)
	}
	if ( obj.tracks || obj.blocks ) {
		ui.mainGrid.change( obj );
	}
	if ( obj.synths ) {
		let objOpened;

		Object.entries( obj.synths ).forEach( ( [ id, obj ] ) => {
			let crudAct = obj ? wa.synths._synths[ id ] ? "update" : "create" : "delete";

			wa.synths[ crudAct ]( id, obj );
			ui.synths[ crudAct ]( id, obj );
		} );
		if ( objOpened = obj.synths[ cmp.synthOpened ] ) {
			ui.synth.change( objOpened );
		}
	}
	if ( obj.patterns ) {
		Object.entries( obj.patterns ).forEach( ( [ id, obj ] ) => {
			let crudAct = obj ? ui.patterns.audioBlocks[ id ] ? "update" : "create" : "delete";

			ui.patterns[ crudAct ]( id, obj );
		} );
	}
	if ( obj.keys ) {
		Object.entries( obj.keys ).forEach( ( [ keysId, keys ] ) => {
			Object.entries( cmp.patterns ).some( ( [ patId, pat ] ) => {
				if ( pat.keys === keysId ) {
					gs.updatePatternContent( patId );
					wa.maingrid.assignPatternChange( pat, keys );
					if ( patId === cmp.patternOpened ) {
						wa.pianoroll.assignPatternChange( keys );
						common.assignDeep( ui.keysGridSamples.data, keys );
					}
					return true;
				}
			} );
		} );
	}
	if ( obj.bpm ) {
		wa.controls.setBPM( obj.bpm );
		ui.controls.bpm( obj.bpm );
	}
	if ( obj.beatsPerMeasure || obj.stepsPerBeat ) {
		ui.mainGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
		ui.keysGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
		Object.keys( cmp.patterns ).forEach( gs.updatePatternContent );
	}
	if ( obj.name != null || obj.bpm || Math.ceil( cmp.duration ) !== Math.ceil( currDur ) ) {
		ui.cmps.update( cmp.id, cmp );
	}
};
