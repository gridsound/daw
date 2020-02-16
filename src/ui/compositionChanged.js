"use strict";

function UIcompositionChanged( obj, prevObj ) {
	console.log( "change", obj );
	UIsynth.change( obj );
	UIdrums.change( obj );
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
	[ "channels", function( { channels } ) {
		const synOpenedDest = DAW.get.synth( DAW.get.synthOpened() ).dest,
			synOpenedChan = channels[ synOpenedDest ],
			chanMap = Object.entries( channels ).reduce( ( map, [ id, obj ] ) => {
				if ( obj && "name" in obj ) {
					map.set( id );
				}
				return map;
			}, new Map() );

		UImixer.change( channels );
		Object.entries( DAW.get.synths() ).forEach( ( [ id, syn ] ) => {
			if ( chanMap.has( syn.dest ) ) {
				UIsynthsRedirectSynth( id, syn.dest );
			}
		} );
		Object.entries( DAW.get.patterns() ).forEach( ( [ id, pat ] ) => {
			if ( chanMap.has( pat.dest ) ) {
				UIredirectPattern( id, pat.dest );
			}
		} );
		if ( synOpenedChan && "name" in synOpenedChan ) {
			DOM.synthChannelBtnText.textContent = synOpenedChan.name;
		}
	} ],
	[ "effects", function( obj ) {
		UIeffects.change( obj.effects );
	} ],
	[ "synths", function( { synths }, prevObj ) {
		const synOpened = DAW.get.synthOpened();

		Object.entries( synths ).forEach( ( [ id, obj ] ) => {
			if ( !obj ) {
				UIsynthsRemoveSynth( id );
			} else if ( !prevObj.synths[ id ] ) {
				UIsynthsAddSynth( id, obj );
			} else {
				UIsynthsUpdateSynth( id, obj );
			}
		} );
		if ( synOpened in synths ) {
			UIsynthChange( synths[ synOpened ] );
		}
	} ],
	[ "patterns", function( { patterns }, prevObj ) {
		Object.entries( patterns ).forEach( ( [ id, obj ] ) => {
			if ( !obj ) {
				UIremovePattern( id, prevObj.patterns[ id ] );
			} else if ( !prevObj.patterns[ id ] ) {
				UIaddPattern( id, obj );
			} else {
				UIupdatePattern( id, obj );
			}
		} );
		gsuiReorder.listReorder( DOM.buffPatterns, patterns );
		UIsynths.forEach( syn => {
			const list = syn.root.querySelector( ".synth-patterns" );

			gsuiReorder.listReorder( list, patterns );
		} );
	} ],
	[ [ "tracks", "blocks" ], function( obj ) {
		GSData.deepAssign( UIpatternroll.data.tracks, obj.tracks );
		GSData.deepAssign( UIpatternroll.data.blocks, obj.blocks );
	} ],
	[ [ "loopA", "loopB" ], function() {
		UIpatternroll.loop(
			DAW.get.loopA(),
			DAW.get.loopB() );
	} ],
	[ [ "beatsPerMeasure", "stepsPerBeat" ], function() {
		const bPM = DAW.get.beatsPerMeasure(),
			sPB = DAW.get.stepsPerBeat();

		UIclock.setStepsPerBeat( sPB );
		UIpatternroll.timeSignature( bPM, sPB );
		UIpianoroll.timeSignature( bPM, sPB );
		DOM.beatsPerMeasure.textContent = bPM;
		DOM.stepsPerBeat.textContent = sPB;
		Object.keys( DAW.get.patterns() ).forEach( UIupdatePatternContent );
	} ],
	[ "bpm", function( { bpm } ) {
		UIclock.setBPM( bpm );
		DOM.bpm.textContent =
		UIcompositions.get( DAW.get.composition() ).bpm.textContent = bpm;
		UIupdatePatternsBPM( bpm );
	} ],
	[ "name", function( { name } ) {
		const cmp = DAW.get.composition();

		UItitle( cmp.name );
		DOM.headCmpName.textContent =
		UIcompositions.get( cmp ).name.textContent = name;
	} ],
	[ "duration", function( { duration } ) {
		const dur = DAWCore.utils.time.beatToMinSec( duration, DAW.get.bpm() );

		if ( DAW.getFocusedName() === "composition" ) {
			DOM.sliderTime.options( { max: duration } );
		}
		DOM.headCmpDur.textContent =
		UIcompositions.get( DAW.get.composition() ).duration.textContent = dur;
	} ],
	[ "drumrows", function( { drumrows } ) {
		const pats = DAW.get.patterns();

		Object.entries( pats ).forEach( ( [ id, pat ] ) => {
			if ( pat.type === "drums" ) {
				UIupdatePatternContent( id );
			}
		} );
	} ],
	[ "drums", function( { drums } ) {
		const pats = DAW.get.patterns(),
			patOpened = pats[ DAW.get.patternDrumsOpened() ];

		Object.entries( pats )
			.filter( kv => kv[ 1 ].type === "drums" && kv[ 1 ].drums in drums )
			.forEach( kv => UIupdatePatternContent( kv[ 0 ] ) );
	} ],
	[ "keys", function( { keys } ) {
		const pats = DAW.get.patterns(),
			patOpened = pats[ DAW.get.patternKeysOpened() ];

		Object.entries( pats )
			.filter( kv => kv[ 1 ].type === "keys" && kv[ 1 ].keys in keys )
			.forEach( kv => UIupdatePatternContent( kv[ 0 ] ) );
		if ( patOpened && patOpened.keys in keys ) {
			GSData.deepAssign( UIpianoroll.data, keys[ patOpened.keys ] );
		}
	} ],
	[ "patternDrumsOpened", function( { patternDrumsOpened }, prevObj ) {
		const pat = DAW.get.pattern( patternDrumsOpened ),
			el = pat && UIpatterns.get( patternDrumsOpened ),
			elPrev = UIpatterns.get( prevObj.patternDrumsOpened );

		DOM.drumsName.textContent = pat ? pat.name : "";
		UIdrums.selectPattern( patternDrumsOpened );
		if ( pat ) {
			el.classList.add( "selected" );
			if ( DAW.getFocusedName() === "drums" ) {
				DOM.sliderTime.options( { max: pat.duration } );
			}
			UIwindows.window( "drums" ).open();
		}
		if ( elPrev ) {
			elPrev.classList.remove( "selected" );
		}
	} ],
	[ "synthOpened", function( { synthOpened }, prevObj ) {
		const el = UIsynths.get( synthOpened ),
			elPrev = UIsynths.get( prevObj.synthOpened );

		el && el.root.classList.add( "synth-selected" );
		elPrev && elPrev.root.classList.remove( "synth-selected" );
		UIsynthOpen( synthOpened );
	} ],
	[ "patternKeysOpened", function( { patternKeysOpened }, prevObj ) {
		const pat = DAW.get.pattern( patternKeysOpened ),
			el = pat && UIpatterns.get( patternKeysOpened ),
			elPrev = UIpatterns.get( prevObj.patternKeysOpened );

		UIpianoroll.empty();
		DOM.pianorollName.textContent = pat ? pat.name : "";
		DOM.pianorollForbidden.classList.toggle( "hidden", pat );
		if ( pat ) {
			el.classList.add( "selected" );
			GSData.deepAssign( UIpianoroll.data, DAW.get.keys( pat.keys ) );
			UIpianoroll.resetKey();
			UIpianoroll.scrollToKeys();
			if ( DAW.getFocusedName() === "pianoroll" ) {
				DOM.sliderTime.options( { max: pat.duration } );
			}
			UIwindows.window( "piano" ).open();
		} else {
			UIpianoroll.setPxPerBeat( 90 );
		}
		if ( elPrev ) {
			elPrev.classList.remove( "selected" );
		}
	} ],
] );
