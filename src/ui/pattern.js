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
		dom.patternName.onclick = ui.pattern._onclickPatternName;
		grid.onchange = ui.pattern._onchangeGrid;
		grid.onchangeCurrentTime = gs.controls.currentTime.bind( null, "pattern" );
		grid.rootElement.onfocus = gs.controls.askFocusOn.bind( null, "pattern" );
		grid.uiKeys.onkeydown = ui.pattern._onkeydown;
		grid.uiKeys.onkeyup = ui.pattern._onkeyup;
		grid.resized();
	},
	empty() {
		ui.pattern.name( "" );
		ui.keysGridSamples.empty();
	},
	name( name ) {
		dom.patternName.textContent = name;
	},
	load( keys ) {
		gs.controls.focusOn( "pattern" );
		ui.keysGridSamples.empty();
		ui.keysGridSamples.change( keys );
		ui.keysGridSamples.scrollToSamples();
	},

	// private:
	_onkeydown( key, oct ) {
		wa.synth.simpleStart( ( key + oct ).toUpperCase() );
	},
	_onkeyup() {
		wa.synth.stop();
	},
	_onchangeGrid( obj ) {
		gs.pushCompositionChange( { keys: {
			[ gs.currCmp.patterns[ gs.currCmp.patternOpened ].keys ]: obj
		} } );
	},
	_onclickPatternName() {
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
