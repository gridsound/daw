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
	open( id ) {
		if ( id ) {
			var pat = gs.currCmp.patterns[ id ];

			ui.pattern._name( pat.name );
			ui.pattern._load( gs.currCmp.keys[ pat.keys ] );
		} else {
			ui.pattern._name( "" );
			ui.keysGridSamples.empty();
		}
		dom.pianorollBlock.classList.toggle( "show", !id );
	},

	// private:
	_name( name ) {
		dom.pianorollName.textContent = name;
	},
	_load( keys ) {
		ui.keysGridSamples.empty();
		ui.keysGridSamples.change( keys );
		ui.keysGridSamples.scrollToSamples();
	},

	// events:
	_onchangeGrid( obj ) {
		gs.pushCompositionChange( { keys: {
			[ gs.currCmp.patterns[ gs.currCmp.patternOpened ].keys ]: obj
		} } );
	},
	_onclickName() {
		var patId = gs.currCmp.patternOpened,
			pat = gs.currCmp.patterns[ patId ],
			n = prompt( "Name pattern :", pat.name );

		if ( n != null && ( n = n.trim() ) !== pat.name ) {
			gs.pushCompositionChange( { patterns: {
				[ patId ]: { name: n }
			} } );
		}
	}
};
