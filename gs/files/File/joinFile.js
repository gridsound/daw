"use strict";

gs.File.prototype.joinFile = function( file ) {
	this.file = file;

	ui.CSS_fileToLoad( this );
	if ( this.fullname !== file.name ) {
		this.fullname = file.name;
		this.name = this.fullname.replace( /\.[^.]+$/, "" );
		this.jqName.text( this.name );
	}

	if ( this.samplesToSet.length ) {
		this.load( function( gsfile ) {
			gsfile.samplesToSet.forEach( function( s ) {
				s.wsample = gsfile.wbuff.createSample();
				s.when( s.savedWhen );
				s.slip( s.savedOffset );
				s.duration( s.savedDuration );
				s.wsample.connect( s.track.wfilters );
				wa.composition.addSamples( [ s.wsample ] );
				s.jqName.text( gsfile.name );
				ui.CSS_sampleDuration( s );
				ui.CSS_sampleWaveform( s );
			} );
		} );
	}
}
