"use strict";

gs.reset = function() {
	ui.tracks.forEach( function( t ) {
		t.editName( "" );
		t.toggle( true );
	} );
	wa.composition.samples.forEach( function( s ) {
		gs.sampleSelect( s, true );
	} );
	gs.samplesDelete();
	gs.files.forEach( function( f ) {
		f.elFile.remove();
	} );
	gs.files = [];
	return this;
};
