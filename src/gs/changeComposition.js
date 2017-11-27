"use strict";

gs.changeComposition = function( obj ) {
	var currSynth,
		cmp = gs.currCmp,
		currDur = cmp.duration,
		replay = false;

	common.assignDeep( cmp, obj );
	if ( obj.tracks || obj.blocks ) {
		ui.mainGrid.change( obj );
		replay = true;
	}
	if ( obj.synths ) {
		wa.synths.change( obj.synths );
		if ( currSynth = obj.synths[ cmp.synthOpened ] ) {
			ui.synth.change( currSynth );
		}
	}
	if ( obj.patterns ) {
		Object.entries( obj.patterns ).forEach( function( [ id, obj ] ) {
			ui.patterns.change( id, obj );
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
