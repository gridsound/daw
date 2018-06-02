"use strict";

ui.pattern = {
	init() {
		const piano = new gsuiPianoroll();

		this.pianoroll = piano;
		piano.octaves( 1, 7 );
		piano.setPxPerBeat( 90 );
		piano.setFontSize( 20 );
		dom.keysGridWrap.append( piano.rootElement );
		dom.pianorollName.onclick = this._onclickName;
		piano.onchange = this._onchangeGrid;
		piano.onchangeLoop = gs.controls.loop.bind( null, "pattern" );
		piano.onchangeCurrentTime = gs.controls.currentTime.bind( null, "pattern" );
		piano.rootElement.onfocus = gs.controls.askFocusOn.bind( null, "pattern" );
		piano.uiKeys.onkeydown = wa.pianoroll.liveStartKey.bind( wa.pianoroll );
		piano.uiKeys.onkeyup = wa.pianoroll.liveStopKey.bind( wa.pianoroll );
		piano.attached();
	},
	empty() {
		this.name( "" );
		// this.pianoroll.contentY( 0 );
		// this.pianoroll.offset( 0, 90 );
		this.pianoroll.setPxPerBeat( 90 );
		this.pianoroll.empty();
	},
	name( name ) {
		dom.pianorollName.textContent = name;
	},
	open( id ) {
		if ( id ) {
			const pat = gs.currCmp.patterns[ id ];

			this.name( pat.name );
			this._load( gs.currCmp.keys[ pat.keys ] );
		} else {
			this.empty();
		}
		dom.pianorollBlock.classList.toggle( "show", !id );
	},
	keyboardEvent( status, e ) {
		const uiKeys = this.pianoroll.uiKeys,
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
		const pianoData = this.pianoroll.data;

		this.pianoroll.empty();
		common.assignDeep( pianoData, keys );
		// this.pianoroll.scrollToSamples();
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
			n = prompt( "Name pattern :", oldName );

		if ( n !== null ) {
			const name = n.trim();

			if ( name !== oldName ) {
				gs.undoredo.change( { patterns: {
					[ id ]: { name }
				} } );
			}
		}
	}
};
