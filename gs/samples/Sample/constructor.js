"use strict";

gs.Sample = function( gsfile, trackId, xem ) {
	this.gsfile = gsfile;

	this.elSample = wisdom.cE( Handlebars.templates.sample( gsfile ) )[ 0 ];
	this.elSVG = this.elSample.querySelector( "svg" );
	this.elName = this.elSample.querySelector( ".name" );
	this.elCropStart = this.elSample.querySelector( ".crop.start" );
	this.elCropEnd = this.elSample.querySelector( ".crop.end" );

	var child, i = 0,
		children = this.elSample.querySelectorAll( "*" );
	while ( child = children[ i++ ] ) {
		child.gsSample = this;
	}

	// Update when files are available
	if ( gsfile.file ) {
		this.wsample = gsfile.wbuff.createSample();
		this.inTrack( trackId );
		this.moveX( xem );
		ui.CSS_sampleDuration( this );
		ui.CSS_sampleWaveform( this );
		wa.composition.addSamples( [ this.wsample ] );
	}

	this.select( false );
};
