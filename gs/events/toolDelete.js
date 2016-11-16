"use strict";

( function() {

ui.tool.delete = {
	mousedown: del,
	mousemove: del,
	mouseup: function() {
		if ( smpDeleted.length ) {
			gs.history.push( "delete", { samples: smpDeleted.slice() } );
			smpDeleted.length = 0;
		}
	}
};

var smpDeleted = [];

function del( e ) {
	var smp = e.target.gsSample;

	if ( smp ) {
		gs.samples.selected.delete( smp );
		smpDeleted.push( smp );
	}
}

} )();
