"use strict";

gs.changeComposition = obj => {
	const cmp = gs.currCmp;

	console.log( "changeComposition", obj );
	gs.currCmpSaved = gs.undoredo.getCurrentAction() === gs.actionSaved;
	ui.cmps.saved( !gs.isCompositionNeedSave() );
	if ( obj.blocks ) {
		wa.mainGrid.assignChange( obj.blocks );
	}
	if ( obj.tracks || obj.blocks ) {
		common.assignDeep( ui.mainGrid.patternroll.data, obj );
	}
	if ( obj.synths ) {
		Object.entries( obj.synths ).forEach( ( [ id, obj ] ) => {
			if ( !obj ) {
				wa.synths.delete( id );
				ui.synths.delete( id );
			} else if ( !ui.synths.list.has( id ) ) {
				wa.synths.create( id, obj );
				ui.synths.create( id, obj );
			} else {
				wa.synths.update( id, obj );
				if ( "name" in obj ) {
					ui.synths.updateName( id, obj.name );
				}
			}
		} );
		if ( cmp.synthOpened in obj.synths ) {
			ui.synth.change( obj.synths[ cmp.synthOpened ] );
		}
	}
	if ( obj.patterns ) {
		Object.entries( obj.patterns ).forEach( ( [ id, obj ] ) => {
			if ( !obj ) {
				ui.patterns.delete( id );
			} else if ( !ui.patterns.list.has( id ) ) {
				ui.patterns.create( id, obj );
			} else {
				if ( obj.synth ) {
					ui.synths.addPattern( obj.synth, id );
				}
				if ( "name" in obj ) {
					const name = obj.name;

					ui.patterns.updateName( id, name );
					ui.mainGrid.updateName( id, name );
					if ( id === gs.currCmp.patternOpened ) {
						ui.pattern.updateName( name );
					}
				}
			}
		} );
	}
	if ( obj.keys ) {
		Object.entries( obj.keys ).forEach( ( [ keysId, keys ] ) => {
			Object.entries( cmp.patterns ).some( ( [ patId, pat ] ) => {
				if ( pat.keys === keysId ) {
					ui.patterns.updateContent( patId );
					ui.mainGrid.updateContent( patId );
					wa.mainGrid.assignPatternChange( pat, keys );
					if ( patId === cmp.patternOpened ) {
						wa.pianoroll.assignPatternChange( keys );
						common.assignDeep( ui.pattern.pianoroll.data, keys );
					}
					return true;
				}
			} );
		} );
	}
	if ( obj.bpm ) {
		ui.controls.bpm( obj.bpm );
		ui.controls.updateClock();
		wa.controls.setBPM( obj.bpm );
	}
	if ( obj.beatsPerMeasure || obj.stepsPerBeat ) {
		ui.mainGrid.patternroll.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
		ui.pattern.pianoroll.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
		Object.keys( cmp.patterns ).forEach( ui.patterns.updateContent.bind( ui.patterns ) );
	}
	if ( obj.bpm || obj.duration != null || obj.name != null ) {
		ui.cmps.update( cmp.id, cmp );
	}
};
