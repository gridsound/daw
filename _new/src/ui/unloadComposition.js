"use strict";

ui.unloadComposition = function( cmp ) {
	ui.controls.currentTime( 0 );
	cmp._html.classList.remove( "loaded" );
};
