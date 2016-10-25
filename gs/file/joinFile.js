"use strict";

gs.file.joinFile = function( that, file ) {
	that.file = file;

	ui.CSS_fileUnloaded( that );
	if ( that.fullname !== file.name ) {
		that.fullname = file.name;
		that.name = that.fullname.replace( /\.[^.]+$/, "" );
		that.elName.textContent = that.name;
	}

	if ( that.samplesToSet.length ) {
		gs.file.load( that, function( that ) {
			that.samplesToSet.forEach( function( smp ) {
				smp.setBuffer( that.wbuff );
				smp.data.elName.textContent = that.name;
				ui.sample.duration( smp );
			} );
		} );
	}
}
