"use strict";

gs.openPattern = function( id ) {
	var pat = gs.currCmp.assets[ id ];

	gs.currCmp.patternOpened = id;
	ui.gridKeys.updateName( pat.name );
	ui.gridKeys.load( gs.currCmp.keys[ pat.keys ] );
};
