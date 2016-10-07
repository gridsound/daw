"use strict";

( function() {

ui.tool.delete = {
	mousedown: del,
	mousemove: del
};

function del( e ) {
	var s = e.target.gsSample;

	if ( s ) {
		gs.history.push( "delete", { samples: [ s ] } );
		gs.samplesDelete( s );
	}
}

} )();
