"use strict";

ui.pattern = {
	init() {
		var grid = new gsuiGridSamples();

		ui.keysGridSamples = grid;
		grid.loadKeys( 1, 7 );
		grid.offset( 0, 120 );
		grid.setFontSize( 20 );
		dom.keysGridWrap.append( grid.rootElement );
		grid.contentY( 2 * 12 );
		dom.pianorollName.onclick = ui.pattern._onclickName;
		grid.onchange = ui.pattern._onchangeGrid;
		grid.onchangeCurrentTime = gs.controls.currentTime.bind( null, "pattern" );
		grid.onchangeLoop = gs.controls.loop.bind( null, "pattern" );
		grid.rootElement.onfocus = gs.controls.askFocusOn.bind( null, "pattern" );
		grid.uiKeys.onkeydown = wa.patternKeys.start;
		grid.uiKeys.onkeyup = wa.patternKeys.stop;
		grid.resized();
	},
	name( name ) {
		dom.pianorollName.textContent = name;
	},
	open( id ) {
		if ( id ) {
			var pat = gs.currCmp.patterns[ id ];

			ui.pattern.name( pat.name );
			ui.pattern._load( gs.currCmp.keys[ pat.keys ] );
		} else {
			ui.pattern.name( "" );
			ui.keysGridSamples.empty();
		}
		dom.pianorollBlock.classList.toggle( "show", !id );
	},
	keyboardEvent( status, e ) {
		var uiKeys = ui.keysGridSamples.uiKeys,
			midi = uiKeys.getMidiKeyFromKeyboard( e );

		if ( midi ) {
			if ( status ) {
				wa.patternKeys.start( midi );
				uiKeys.midiKeyDown( midi );
			} else {
				wa.patternKeys.stop( midi );
				uiKeys.midiKeyUp( midi );
			}
			return true;
		}
	},

	// private:
	_load( keys ) {
		ui.keysGridSamples.empty();
		ui.keysGridSamples.change( keys );
		ui.keysGridSamples.scrollToSamples();
	},

	// events:
	_onchangeGrid( obj ) {
		gs.undoredo.change( { keys: {
			[ gs.currCmp.patterns[ gs.currCmp.patternOpened ].keys ]: obj
		} } );
	},
	_onclickName() {
		var patId = gs.currCmp.patternOpened,
			pat = gs.currCmp.patterns[ patId ],
			n = prompt( "Name pattern :", pat.name );

		if ( n != null && ( n = n.trim() ) !== pat.name ) {
			gs.undoredo.change( { patterns: {
				[ patId ]: { name: n }
			} } );
		}
	}
};
