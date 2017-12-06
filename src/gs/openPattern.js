"use strict";

gs.openPattern = function( id ) {
	var synthId,
		cmp = gs.currCmp;

	id = id || null;
	cmp.patternOpened = id;
	if ( id ) {
		synthId = cmp.patterns[ id ].synth;
		gs.controls.focusOn( "pattern" );
		wa.grids.replay();
		wa.synths.select( synthId );
		if ( synthId !== cmp.synthOpened ) {
			gs.openSynth( synthId );
		}
	} else {
		gs.controls.focusOn( "main" );
	}
	ui.patterns.select( id );
	ui.pattern.open( id );
};
