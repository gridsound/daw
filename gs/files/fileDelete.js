"use strict";

gs.fileDelete = function( file ) {
	wa.composition.samples.filter( function( smp ) {
		return smp.data.gsfile === file;
	} ).forEach( function( smp ) {
		gs.sample.delete( smp );
	} );
	gs.files.splice( gs.files.indexOf( file ), 1 );
	file.delete();
};
