"use strict";

gs.reset = function() {
	ui.tracks.forEach( function( t ) {
		t.editName( "" );
		t.toggle( true );
	} );
	gs.samples.forEach( function( s ) {
		gs.sampleDelete( s );
	} );
	gs.files.forEach( function( f ) {
		f.elFile.remove();
	} );
	gs.files = [];
	return this;
};
