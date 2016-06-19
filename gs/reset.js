"use strict";

gs.reset = function() {
	ui.tracks.forEach( function( t ) {
		t.editName( "" );
		t.toggle( true );
	} );
	gs.samples.forEach( function( s ) {
		gs.sampleSelect( s, true );
	} );
	gs.samplesDelete();
	gs.files.forEach( function( f ) {
		f.jqFile.remove();
	} );
	gs.files = [];
};
