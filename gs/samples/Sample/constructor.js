"use strict";

gs.Sample = function( gsfile, trackId, when ) {
	this.gsfile = gsfile;

	ui.CSS_sampleCreate( this );

	// Update when files are available
	if ( gsfile.file ) {
		this.wsample = gsfile.wbuff.createSample();
		this.inTrack( trackId );
		this.when( when );
		ui.CSS_sampleDuration( this );
		ui.CSS_sampleWaveform( this );
		wa.composition.addSamples( [ this.wsample ] );
	}

	this.select( false );
};
