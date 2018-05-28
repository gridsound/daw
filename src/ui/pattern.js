"use strict";

ui.pattern = {
	init() {
		const piano = new gsuiPianoroll();

		ui.keysGridSamples = piano;
		piano.octaves( 1, 7 );
		piano.setPxPerBeat( 90 );
		piano.setFontSize( 20 );
		dom.keysGridWrap.append( piano.rootElement );
		dom.pianorollName.onclick = ui.pattern._onclickName;
		piano.onchange = ui.pattern._onchangeGrid;
		piano.onchangeLoop = gs.controls.loop.bind( null, "pattern" );
		piano.onchangeCurrentTime = gs.controls.currentTime.bind( null, "pattern" );
		piano.rootElement.onfocus = gs.controls.askFocusOn.bind( null, "pattern" );
		piano.uiKeys.onkeydown = wa.pianoroll.liveStartKey.bind( wa.pianoroll );
		piano.uiKeys.onkeyup = wa.pianoroll.liveStopKey.bind( wa.pianoroll );
		piano.attached();
	},
	empty() {
		ui.pattern.name( "" );
		// ui.keysGridSamples.contentY( 0 );
		// ui.keysGridSamples.offset( 0, 90 );
		ui.keysGridSamples.setPxPerBeat( 90 );
		ui.keysGridSamples.empty();
	},
	name( name ) {
		dom.pianorollName.textContent = name;
	},
	open( id ) {
		if ( id ) {
			const pat = gs.currCmp.patterns[ id ];

			ui.pattern.name( pat.name );
			ui.pattern._load( gs.currCmp.keys[ pat.keys ] );
		} else {
			ui.pattern.empty();
		}
		dom.pianorollBlock.classList.toggle( "show", !id );
	},
	keyboardEvent( status, e ) {
		const uiKeys = ui.keysGridSamples.uiKeys,
			midi = uiKeys.getMidiKeyFromKeyboard( e );

		if ( midi ) {
			if ( status ) {
				wa.pianoroll.liveStartKey( midi );
				uiKeys.midiKeyDown( midi );
			} else {
				wa.pianoroll.liveStopKey( midi );
				uiKeys.midiKeyUp( midi );
			}
			return true;
		}
	},

	// private:
	_load( keys ) {
		const pianoData = ui.keysGridSamples.data;

		ui.keysGridSamples.empty();
		common.assignDeep( pianoData, keys );
		// ui.keysGridSamples.scrollToSamples();
	},

	// events:
	_onchangeGrid( obj ) {
		gs.undoredo.change( { keys: {
			[ gs.currCmp.patterns[ gs.currCmp.patternOpened ].keys ]: obj
		} } );
	},
	_onclickName() {
		const id = gs.currCmp.patternOpened,
			oldName = gs.currCmp.patterns[ id ].name,
			n = prompt( "Name pattern :", oldName ),
			name = n != null && n.trim();

		if ( name !== oldName ) {
			gs.undoredo.change( { patterns: { [ id ]: { name } } } );
		}
	}
};
