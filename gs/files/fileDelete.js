"use strict";

gs.fileDelete = function( file ) {
	var toRemove = gs.samples.filter( function( s ) {
		return s.gsfile === file;
	});
	toRemove.forEach( function( s ) {
		gs.sampleDelete( s );
	} );
	gs.files.splice( gs.files.indexOf( file ), 1 );
	file.delete();
};
