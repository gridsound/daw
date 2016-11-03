"use strict";

gs.file.joinFile = function( that, file ) {
	var wbuff = that.wbuff;

	ui.file.unloaded( that );
	if ( that.fullname !== file.name ) {
		that.fullname = file.name;
		that.name = that.fullname.replace( /\.[^.]+$/, "" );
		that.elName.textContent = that.name;
	}

	that.file = file;
	gs.file.load( that, function( that ) {
		wbuff.samples.forEach( function( smp ) {
			smp.data.elName.textContent = that.name;
			ui.sample.duration( smp );
		} );
	} );
}
