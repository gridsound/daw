"use strict";

gs.Sample = function( gsfile, trackId, when ) {
	this.gsfile = gsfile;

	this.elSample = wisdom.cE( Handlebars.templates.sample( gsfile ) )[ 0 ];
	this.elSVG = wisdom.qS( this.elSample, "svg" );
	this.elName = wisdom.qS( this.elSample, ".name" );
	this.elCropStart = wisdom.qS( this.elSample, ".crop.start" );
	this.elCropEnd = wisdom.qS( this.elSample, ".crop.end" );

	wisdom.qSA( this.elSample, "*" ).forEach( function( el ) {
		el.gsSample = this;
	}, this );

	// Update when files are available
	if ( gsfile.file ) {
		this.wsample = gsfile.wbuff.createSample();
		this.inTrack( trackId );
		this.when( when );
		ui.CSS_sampleDuration( this );
		ui.CSS_sampleWaveform( this );
		wa.composition.add( [ this.wsample ] );
	}

	this.select( false );
};
