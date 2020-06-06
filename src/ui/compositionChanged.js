"use strict";

function UIcompositionChanged( obj, prevObj ) {
	console.log( "change", obj );
	UIpatterns.change( obj );
	UIsynth.change( obj );
	UIdrums.change( obj );
	UIeffects.change( obj );
	UImixer.change( obj );
	UIcompositionChanged.fn.forEach( ( fn, attrs ) => {
		if ( attrs.some( attr => attr in obj ) ) {
			fn( obj, prevObj );
		}
	} );
}

UIcompositionChanged.fn = new Map( [
	[ [ "channels" ], function( obj ) {
		const synOpenedChan = obj.channels[ DAW.get.synth( DAW.get.synthOpened() ).dest ],
			mixerSelectedChan = obj.channels[ UIeffects.getDestFilter() ];

		if ( synOpenedChan && "name" in synOpenedChan ) {
			DOM.synthChannelBtnText.textContent = synOpenedChan.name;
		}
		if ( mixerSelectedChan && "name" in mixerSelectedChan ) {
			UIeffectsRenameChan( mixerSelectedChan.name );
		}
	} ],
	[ [ "synths" ], function( obj ) {
		const synOpened = obj.synths[ DAW.get.synthOpened() ];

		if ( synOpened ) {
			UIsynthChange( synOpened );
		}
	} ],
	[ [ "tracks", "blocks" ], function( obj ) {
		GSUtils.diffAssign( UIpatternroll.data.tracks, obj.tracks );
		GSUtils.diffAssign( UIpatternroll.data.blocks, obj.blocks );
	} ],
	[ [ "patterns" ], function( obj ) {
		Object.entries( obj.patterns ).forEach( kv => UIupdatePattern( ...kv ) );
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
	} ],
	[ [ "bpm" ], function( { bpm } ) {
		UIclock.setBPM( bpm );
		DOM.bpm.textContent =
		UIcompositions.get( DAW.get.cmp() ).bpm.textContent = bpm;
		UIupdatePatternsBPM( bpm );
	} ],
	[ [ "name" ], function( { name } ) {
		UItitle( name );
		DOM.headCmpName.textContent =
		UIcompositions.get( DAW.get.cmp() ).name.textContent = name;
	} ],
	[ [ "duration" ], function( { duration } ) {
		const [ min, sec ] = GSUtils.parseBeatsToSeconds( duration, DAW.get.bpm() );

		if ( DAW.getFocusedName() === "composition" ) {
			DOM.sliderTime.options( { max: duration } );
		}
		DOM.headCmpDur.textContent =
		UIcompositions.get( DAW.get.cmp() ).duration.textContent = `${ min }:${ sec }`;
	} ],
	[ [ "keys" ], function( { keys } ) {
		const patOpened = DAW.get.pattern( DAW.get.patternKeysOpened() );

		if ( patOpened && patOpened.keys in keys ) {
			GSUtils.diffAssign( UIpianoroll.data, keys[ patOpened.keys ] );
		}
	} ],
	[ [ "patternDrumsOpened" ], function( obj ) {
		if ( obj.patternDrumsOpened ) {
			const pat = DAW.get.pattern( obj.patternDrumsOpened );

			DOM.drumsName.textContent = pat.name;
			UIwindows.window( "drums" ).open();
			if ( DAW.getFocusedName() === "drums" ) {
				DOM.sliderTime.options( { max: pat.duration } );
			}
		} else {
			DOM.drumsName.textContent = "";
		}
	} ],
	[ [ "synthOpened" ], function( obj ) {
		if ( obj.synthOpened ) {
			const syn = DAW.get.synth( obj.synthOpened );

			DOM.synthName.textContent = syn.name;
			DOM.synthChannelBtn.onclick = UImixerOpenChanPopup.bind( null, obj.synthOpened );
			UIwindows.window( "synth" ).open();
		} else {
			DOM.synthName.textContent = "";
			DOM.synthChannelBtn.onclick = null;
		}
	} ],
	[ [ "patternKeysOpened" ], function( { patternKeysOpened } ) {
		UIpianoroll.empty();
		if ( patternKeysOpened ) {
			const pat = DAW.get.pattern( patternKeysOpened );

			DOM.pianorollName.textContent = pat.name;
			DOM.pianorollForbidden.classList.add( "hidden" );
			GSUtils.diffAssign( UIpianoroll.data, DAW.get.keys( pat.keys ) );
			UIpianoroll.resetKey();
			UIpianoroll.scrollToKeys();
			if ( DAW.getFocusedName() === "pianoroll" ) {
				DOM.sliderTime.options( { max: pat.duration } );
			}
			UIwindows.window( "piano" ).open();
		} else {
			DOM.pianorollName.textContent = "";
			DOM.pianorollForbidden.classList.remove( "hidden" );
			UIpianoroll.setPxPerBeat( 90 );
		}
	} ],
] );
