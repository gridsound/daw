"use strict";

gs.compositions.init = function() {
	var cmps = localStorage.compositions;

	( gs.compositions.list = cmps ? JSON.parse( cmps ) : [] )
		.forEach( function( cmp ) {
			ui.save.addComposition( cmp );
		} );
};
