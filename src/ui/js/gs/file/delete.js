"use strict";

gs.file.delete = function( that ) {
	gs.composition.samples.filter( function( smp ) {
		return smp.data.gsfile === that;
	} ).forEach( function( smp ) {
		gs.sample.delete( smp );
	} );
	gs.files.splice( gs.files.indexOf( that ), 1 );
	that.elFile.remove();
};
