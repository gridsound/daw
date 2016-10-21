"use strict";

gs.File.prototype.joinFile = function( file ) {
	this.file = file;

	ui.CSS_fileUnloaded( this );
	if ( this.fullname !== file.name ) {
		this.fullname = file.name;
		this.name = this.fullname.replace( /\.[^.]+$/, "" );
		this.elName.textContent = this.name;
	}

	if ( this.samplesToSet.length ) {
		this.load( function( gsfile ) {
			gsfile.samplesToSet.forEach( function( smp ) {
				smp.setBuffer( gsfile.wbuff );
				smp.data.elName.textContent = gsfile.name;
				ui.CSS_sampleWaveform( smp );
				ui.CSS_sampleDuration( smp );
			} );
		} );
	}
}
