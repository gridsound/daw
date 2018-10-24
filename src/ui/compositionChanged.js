"use strict";

function UIcompositionChanged( obj, prevObj ) {
	const cmp = DAW.get.composition();

	console.log( "UIcompositionChanged", obj );
	UIcompositionChanged.fn.forEach( ( fn, attr ) => {
		if ( typeof attr === "string" ) {
			if ( attr in obj ) {
				fn.call( this, obj, prevObj );
			}
		} else if ( attr.some( attr => attr in obj ) ) {
			fn.call( this, obj, prevObj );
		}
	} );
}

UIcompositionChanged.fn = new Map( [
	[ [ "tracks", "blocks" ], function( obj ) {
		DAWCore.objectDeepAssign( UIpatternroll.data, obj );
	} ],
	[ [ "loopA", "loopB" ], function() {
		UIpatternroll.loop(
			DAW.get.loopA(),
			DAW.get.loopB() );
	} ],
	[ "synths", function( { synths }, prevObj ) {
		const synOpened = DAW.get.synthOpened();

		Object.entries( synths ).forEach( ( [ id, obj ] ) => {
			if ( !obj ) {
				UIsynths.get( id ).remove();
				UIsynths.delete( id );
			} else if ( !prevObj.synths[ id ] ) {
				UIsynthsAddSynth( id, obj );
			} else if ( "name" in obj ) {
				UIsynthsNameSynth( id, obj.name );
			}
		} );
		if ( synOpened in synths ) {
			UIsynthChange( synths[ synOpened ] );
		}
	} ],
	[ "patterns", function( { patterns }, prevObj ) {
		Object.entries( patterns ).forEach( ( [ id, obj ] ) => {
			if ( !obj ) {
				UIpatterns.get( id ).remove();
				UIpatterns.delete( id );
			} else if ( !prevObj.patterns[ id ] ) {
				UIaddPattern( id, obj );
			} else {
				if ( obj.synth ) {
					UIchangePatternSynth( id, obj.synth );
				}
				if ( "name" in obj ) {
					UInamePattern( id, obj.name );
				}
			}
		} );
	} ],
	[ [ "beatsPerMeasure", "stepsPerBeat" ], function() {
		const bPM = DAW.get.beatsPerMeasure(),
			sPB = DAW.get.stepsPerBeat();

		UIpatternroll.timeSignature( bPM, sPB );
		UIpianoroll.timeSignature( bPM, sPB );
		Object.keys( DAW.get.patterns() ).forEach( UIupdatePatternContent );
	} ],
	[ "bpm", function( { bpm } ) {
		DOM.bpmNumber.textContent =
		UIcompositions.get( DAW.get.id() ).bpm.textContent = bpm;
	} ],
	[ "name", function( { name } ) {
		UItitle();
		UIcompositions.get( DAW.get.id() ).name.textContent = name;
	} ],
	[ "duration", function( { duration } ) {
		UIcompositions.get( DAW.get.id() ).duration.textContent =
			DAWCore.time.beatToMinSec( duration, DAW.get.bpm() );
	} ],
	[ "keys", function( { keys } ) {
		const pats = Object.entries( DAW.get.patterns() ),
			patOpened = DAW.get.patternOpened();

		Object.entries( keys ).forEach( ( [ keysId, keysObj ] ) => {
			pats.some( ( [ patId, patObj ] ) => {
				if ( patObj.keys === keysId ) {
					UIupdatePatternContent( patId );
					if ( patId === patOpened ) {
						DAWCore.objectDeepAssign( UIpianoroll.data, keysObj );
					}
					return true;
				}
			} );
		} );
	} ],
	[ "synthOpened", function( { synthOpened }, prevObj ) {
		const el = UIsynths.get( synthOpened ),
			elPrev = UIsynths.get( prevObj.synthOpened );

		el && el.classList.add( "synth-selected" );
		elPrev && elPrev.classList.remove( "synth-selected" );
		UIsynthOpen( synthOpened );
	} ],
	[ "patternOpened", function( { patternOpened }, prevObj ) {
		const pat = DAW.get.pattern( patternOpened ),
			el = pat && UIpatterns.get( patternOpened ),
			elPrev = UIpatterns.get( prevObj.patternOpened );

		UIpianoroll.empty();
		DOM.pianorollName.textContent = pat ? pat.name : "";
		DOM.pianorollBlock.classList.toggle( "show", !pat );
		if ( pat ) {
			el.classList.add( "selected" );
			DAWCore.objectDeepAssign( UIpianoroll.data, DAW.get.keys( pat.keys ) );
			UIpianoroll.resetKey();
			UIpianoroll.scrollToKeys();
		} else {
			UIpianoroll.setPxPerBeat( 90 );
		}
		if ( elPrev ) {
			elPrev.classList.remove( "selected" );
		}
	} ],
] );
