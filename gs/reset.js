"use strict";

gs.reset = function() {
	ui.tracks.forEach( function( track ) {
		track.editName( "" );
		track.toggle( true );
	} );
	gs.samples.forEach( function( sample ) {
		gs.sampleSelect( sample, true );
	} );
	gs.samplesDelete();
	ui.files.forEach( function( file ) {
		file.jqFile.remove();
	} );
	ui.files = [];
};
