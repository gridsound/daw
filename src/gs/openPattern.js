"use strict";

gs.openPattern = function( id ) {
	var cmp = gs.currCmp,
		pat = cmp.patterns[ id ];

	cmp.patternOpened = id;
	gs.controls.focusOn( "pattern" );
	ui.patterns.select( id );
	ui.pattern.name( pat.name );
	ui.pattern.load( cmp.keys[ pat.keys ] );
};
