"use strict";

gs.changeComposition = function( obj ) {
	var crudAct,
		objOpened,
		cmp = gs.currCmp,
		currDur = cmp.duration,
		replay = false;

	gs.currCmpSaved = gs.undoredo.getCurrentAction() === gs.actionSaved;
	ui.cmps.saved( !gs.isCompositionNeedSave() );
	if ( obj.tracks || obj.blocks ) {
		ui.mainGrid.change( obj );
		replay = true;
	}
	if ( obj.synths ) {
		Object.entries( obj.synths ).forEach( ( [ id, obj ] ) => {
			crudAct = obj ? wa.synths._synths[ id ] ? "update" : "create" : "delete";
			wa.synths[ crudAct ]( id, obj );
			ui.synths[ crudAct ]( id, obj );
		} );
		if ( objOpened = obj.synths[ cmp.synthOpened ] ) {
			ui.synth.change( objOpened );
		}
	}
	if ( obj.patterns ) {
		Object.entries( obj.patterns ).forEach( function( [ id, obj ] ) {
			crudAct = obj ? ui.patterns.audioBlocks[ id ] ? "update" : "create" : "delete";
			ui.patterns[ crudAct ]( id, obj );
		} );
		replay = true;
	}
	if ( obj.keys ) {
		Object.entries( obj.keys ).forEach( function( [ keysId, keysObj ] ) {
			Object.entries( cmp.patterns ).some( function( [ patId, pat ] ) {
				if ( pat.keys === keysId ) {
					gs.updatePatternContent( patId );
					if ( patId === cmp.patternOpened ) {
						ui.keysGridSamples.change( keysObj );
					}
					return true;
				}
			} );
		} );
		replay = true;
	}
	if ( obj.bpm ) {
		ui.controls.bpm( obj.bpm );
		replay = true;
	}
	if ( obj.beatsPerMeasure || obj.stepsPerBeat ) {
		ui.mainGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
		ui.keysGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
		Object.keys( cmp.patterns ).forEach( gs.updatePatternContent );
	}
	cmp.duration = Object.values( cmp.blocks ).reduce( function( dur, blc ) {
		return Math.max( dur, blc.when + blc.duration );
	}, 0 );
	if ( obj.name != null || obj.bpm || Math.ceil( cmp.duration ) !== Math.ceil( currDur ) ) {
		ui.cmps.update( cmp.id, cmp );
	}
	replay && wa.grids.replay();
};
