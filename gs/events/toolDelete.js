"use strict";

( function() {

ui.tool.delete = {
	mousedown: del,
	mousemove: del
};

function del( e ) {
	var smp = e.target.gsSample;

	if ( smp ) {
		gs.history.push( "delete", { samples: [ smp ] } );
		gs.samples.selected.delete( smp );
	}
}

} )();
