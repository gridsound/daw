"use strict";

gs.Sample = function( gsfile ) {
	this.gsfile = gsfile;

	this.jqSample = $( "<div class='sample'>" );
	this.jqWaveformWrapper = $( "<div class='waveformWrapper'>" ).appendTo( this.jqSample );
	this.jqWaveform = $( "<canvas class='waveform'>" ).appendTo( this.jqWaveformWrapper );
	this.jqName = $( "<span class='name text-overflow'>" ).appendTo( this.jqSample ).text( gsfile.name );
	this.jqCropStart = $( "<div class='crop start'>" ).appendTo( this.jqSample );
	this.jqCropEnd = $( "<div class='crop end'>" ).appendTo( this.jqSample );

	this.jqName[ 0 ].gsSample =
	this.jqWaveformWrapper[ 0 ].gsSample =
	this.jqWaveform[ 0 ].gsSample =
	this.jqCropStart[ 0 ].gsSample =
	this.jqCropEnd[ 0 ].gsSample = this;

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
