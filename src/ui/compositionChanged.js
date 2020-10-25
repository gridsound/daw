"use strict";

function UIcompositionChanged( obj, prevObj ) {
	console.log( "change", obj );
	UIpatterns.change( obj );
	UIsynth.change( obj );
	UIdrums.change( obj );
	UIeffects.change( obj );
	UImixer.change( obj );
	UIpianoroll.change( obj );
	UIpatternroll.change( obj );
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
	[ [ "patterns" ], function( obj ) {
		Object.entries( obj.patterns ).forEach( kv => UIupdatePattern( ...kv ) );
	} ],
	[ [ "beatsPerMeasure", "stepsPerBeat" ], function() {
		const bPM = DAW.get.beatsPerMeasure(),
			sPB = DAW.get.stepsPerBeat();

		UIclock.setAttribute( "stepsPerBeat", sPB );
		DOM.beatsPerMeasure.textContent = bPM;
		DOM.stepsPerBeat.textContent = sPB;
	} ],
	[ [ "bpm" ], function( { bpm } ) {
		UIclock.setAttribute( "bpm", bpm );
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
			DOM.sliderTime.setAttribute( "max", duration );
		}
		DOM.headCmpDur.textContent =
		UIcompositions.get( DAW.get.cmp() ).duration.textContent = `${ min }:${ sec }`;
	} ],
	[ [ "patternDrumsOpened" ], function( obj ) {
		if ( obj.patternDrumsOpened ) {
			const pat = DAW.get.pattern( obj.patternDrumsOpened );

			DOM.drumsName.textContent = pat.name;
			UIwindows.window( "drums" ).open();
			if ( DAW.getFocusedName() === "drums" ) {
				DOM.sliderTime.setAttribute( "max", pat.duration );
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
		if ( patternKeysOpened ) {
			const pat = DAW.get.pattern( patternKeysOpened );

			DOM.pianorollName.textContent = pat.name;
			DOM.pianorollForbidden.classList.add( "hidden" );
			if ( DAW.getFocusedName() === "pianoroll" ) {
				DOM.sliderTime.setAttribute( "max", pat.duration );
			}
			UIwindows.window( "piano" ).open();
		} else {
			DOM.pianorollName.textContent = "";
			DOM.pianorollForbidden.classList.remove( "hidden" );
		}
	} ],
] );
