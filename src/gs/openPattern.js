"use strict";

gs.openPattern = function( id ) {
	var pat = gs.currCmp.patterns[ id ];

	gs.currCmp.patternOpened = id;
	ui.pattern.name( pat.name );
	ui.pattern.load( gs.currCmp.keys[ pat.keys ] );
};
