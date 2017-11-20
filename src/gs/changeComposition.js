"use strict";

gs.changeComposition = function( obj ) {
	var keysId, patId, blcId, synthId,
		blc,
		cmp = gs.currCmp,
		dur = 0,
		currDur = cmp.duration,
		bPM = obj.beatsPerMeasure,
		sPB = obj.stepsPerBeat;

	common.assignDeep( cmp, obj );
	ui.mainGrid.change( obj );
	if ( obj.synths ) {
		ui.synth.change( obj.synths[ cmp.synthOpened ] );
	}
	for ( patId in obj.patterns ) {
		ui.patterns.change( patId, obj.patterns[ patId ] );
		wa.patterns.change( patId, obj.patterns[ patId ] );
	}
	for ( keysId in obj.keys ) {
		for ( patId in cmp.patterns ) {
			if ( cmp.patterns[ patId ].keys === keysId ) {
				gs.updatePatternContent( patId );
				if ( patId === cmp.patternOpened ) {
					ui.keysGridSamples.change( obj.keys[ keysId ] );
				}
				break;
			}
		}
	}
	if ( obj.bpm ) {
		ui.controls.bpm( obj.bpm );
	}
	if ( bPM || sPB ) {
		ui.mainGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
		ui.keysGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
		for ( patId in cmp.patterns ) {
			gs.updatePatternContent( patId );
		}
	}
	for ( blcId in cmp.blocks ) {
		blc = cmp.blocks[ blcId ];
		dur = Math.max( dur, blc.when + blc.duration );
	}
	cmp.duration = dur;
	if ( obj.name != null || obj.bpm || Math.ceil( dur ) !== Math.ceil( currDur ) ) {
		ui.cmps.update( cmp.id, cmp );
	}
	wa.grids.replay();
};
