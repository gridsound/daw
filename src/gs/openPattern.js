"use strict";

gs.openPattern = function( id ) {
	var cmp = gs.currCmp,
		pat = cmp.patterns[ id ];

	cmp.patternOpened =
	id = pat ? id : null;
	gs.controls.askFocusOn( pat ? "pattern" : "main" );
	if ( pat ) {
		wa.pianoroll.assignPattern( id );
		wa.synths.select( pat.synth );
		if ( pat.synth !== cmp.synthOpened ) {
			gs.openSynth( pat.synth );
		}
	}
	ui.patterns.select( id );
	ui.pattern.open( id );
};
