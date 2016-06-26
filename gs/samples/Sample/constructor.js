"use strict";

gs.Sample = function( gsfile ) {
	this.gsfile = gsfile;

	this.jqSample = $( Handlebars.templates.sample( gsfile ) );
	this.jqWaveformWrapper = this.jqSample.find( ".waveformWrapper" );
	this.jqWaveform = this.jqSample.find( ".waveform" );
	this.jqName = this.jqSample.find( ".name" );
	this.jqCropStart = this.jqSample.find( ".crop.start" );
	this.jqCropEnd = this.jqSample.find( ".crop.end" );

	var that = this;
	this.jqSample.find( "*" ).each( function() {
		this.gsSample = that;
	} );

	// Update when files are available
	if ( gsfile.file ) {
		this.wsample = gsfile.wbuff.createSample();
		this.canvas = this.jqWaveform[ 0 ];
		this.canvasCtx = this.canvas.getContext( "2d" );
		ui.CSS_sampleDuration( this );
		ui.CSS_sampleWaveform( this );
	}

	this.select( false );
};
