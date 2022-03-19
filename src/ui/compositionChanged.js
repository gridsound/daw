"use strict";

function UIcompositionChanged( obj, prevObj ) {
	console.log( "change", obj );
	UIpatterns.change( obj );
	UIsynth.change( obj );
	UIdrums.change( obj );
	UIeffects.change( obj );
	UImixer.change( obj );
	UIslicer.change( obj );
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
		const synOpenedChan = obj.channels[ DAW.get.synth( DAW.get.opened( "synth" ) ).dest ],
			mixerSelectedChan = obj.channels[ UIeffects.getDestFilter() ];

		if ( synOpenedChan && "name" in synOpenedChan ) {
			DOM.synthChannelBtnText.textContent = synOpenedChan.name;
		}
		if ( mixerSelectedChan && "name" in mixerSelectedChan ) {
			UIeffectsRenameChan( mixerSelectedChan.name );
		}
	} ],
	[ [ "synths" ], function( obj ) {
		const synOpened = obj.synths[ DAW.get.opened( "synth" ) ];

		if ( synOpened ) {
			UIsynthChange( synOpened );
		}
	} ],
	[ [ "patterns" ], function( obj ) {
		Object.entries( obj.patterns ).forEach( kv => UIupdatePattern( ...kv ) );
	} ],
	[ [ "beatsPerMeasure", "stepsPerBeat" ], function() {
		GSUI.setAttribute( UIdaw, "timedivision", `${ DAW.get.beatsPerMeasure() }/${ DAW.get.stepsPerBeat() }` );
	} ],
	[ [ "bpm" ], function( { bpm } ) {
		GSUI.setAttribute( UIdaw, "bpm", bpm );
		UIdaw.updateComposition( DAW.get.cmp() );
	} ],
	[ [ "name" ], function( { name } ) {
		UItitle( name );
		UIdaw.updateComposition( DAW.get.cmp() );
		GSUI.setAttribute( UIdaw, "name", name );
	} ],
	[ [ "duration" ], function( { duration } ) {
		if ( DAW.getFocusedName() === "composition" ) {
			GSUI.setAttribute( UIdaw, "duration", duration );
		}
		UIdaw.updateComposition( DAW.get.cmp() );
	} ],
	[ [ "patternSlicesOpened" ], function( obj ) {
		if ( obj.patternSlicesOpened ) {
			const pat = DAW.get.pattern( obj.patternSlicesOpened );

			DOM.slicesName.textContent = pat.name;
			UIwindows.window( "slicer" ).open();
			if ( DAW.getFocusedName() === "slices" ) {
				GSUI.setAttribute( UIdaw, "duration", pat.duration );
			}
		} else {
			DOM.slicesName.textContent = "";
		}
	} ],
	[ [ "patternDrumsOpened" ], function( obj ) {
		if ( obj.patternDrumsOpened ) {
			const pat = DAW.get.pattern( obj.patternDrumsOpened );

			DOM.drumsName.textContent = pat.name;
			UIwindows.window( "drums" ).open();
			if ( DAW.getFocusedName() === "drums" ) {
				GSUI.setAttribute( UIdaw, "duration", pat.duration );
			}
		} else {
			DOM.drumsName.textContent = "";
		}
	} ],
	[ [ "synthOpened" ], function( obj ) {
		if ( obj.synthOpened ) {
			const syn = DAW.get.synth( obj.synthOpened );

			DOM.synthName.textContent = syn.name;
			DOM.synthChannelBtnText.textContent = DAW.get.channel( DAW.get.synth( obj.synthOpened ).dest ).name;
			UIwindows.window( "synth" ).open();
		} else {
			DOM.synthName.textContent = "";
			DOM.synthChannelBtnText.textContent = "";
		}
	} ],
	[ [ "patternKeysOpened" ], function( { patternKeysOpened } ) {
		if ( patternKeysOpened ) {
			const pat = DAW.get.pattern( patternKeysOpened );

			DOM.pianorollName.textContent = pat.name;
			if ( DAW.getFocusedName() === "keys" ) {
				GSUI.setAttribute( UIdaw, "duration", pat.duration );
			}
			UIwindows.window( "piano" ).open();
		} else {
			DOM.pianorollName.textContent = "";
		}
	} ],
] );
