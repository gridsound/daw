"use strict";

ui.unloadComposition = function( cmp ) {
	ui.controls.currentTime( 0 );
	ui.cmpUnload( cmp );
};
