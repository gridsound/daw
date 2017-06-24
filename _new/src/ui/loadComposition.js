"use strict";

ui.loadComposition = function( cmp ) {
	ui.controls.bpm( cmp.bpm );
	ui.controls.currentTime( 0 );
	cmp._html.classList.add( "loaded" );
	ui.idElements.cmps.prepend( cmp._html );
};
