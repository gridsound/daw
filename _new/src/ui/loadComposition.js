"use strict";

ui.loadComposition = function( cmp ) {
	ui.controls.bpm( cmp.bpm );
	ui.controls.currentTime( 0 );
	ui.cmpLoad( cmp );
};
