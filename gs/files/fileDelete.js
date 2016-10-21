"use strict";

gs.fileDelete = function( file ) {
	wa.composition.samples.filter( function( s ) {
		return s.gsfile === file;
	} ).forEach( function( s ) {
		gs.sampleDelete( s );
	} );
	gs.files.splice( gs.files.indexOf( file ), 1 );
	file.delete();
};
