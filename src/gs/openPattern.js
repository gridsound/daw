"use strict";

gs.openPattern = function( id ) {
	id = id || null;
	if ( id !== gs.currCmp.patternOpened ) {
		gs.currCmp.patternOpened = id;
		if ( id ) {
			gs.controls.focusOn( "pattern" );
			wa.grids.replay();
			wa.synths.select( gs.currCmp.patterns[ id ].synth );
		} else {
			gs.controls.focusOn( "main" );
		}
		ui.patterns.select( id );
		ui.pattern.open( id );
	}
};
