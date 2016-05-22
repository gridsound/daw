"use strict";

gs.Sample = function( uifile ) {
	this.uifile = uifile;
	this.wsample = uifile.wbuff.createSample();

	this.jqSample = $( "<div class='sample'>" );
	this.jqWaveformWrapper = $( "<div class='waveformWrapper'>" ).appendTo( this.jqSample );
	this.jqWaveform = $( "<canvas class='waveform'>" ).appendTo( this.jqWaveformWrapper );
	this.jqName = $( "<span class='text-overflow'>" ).appendTo( this.jqSample ).text( uifile.name );
	this.jqCropEnd = $( "<div class='crop end'>" ).appendTo( this.jqSample );

	this.canvas = this.jqWaveform[ 0 ];
	this.canvasCtx = this.canvas.getContext( "2d" );

	this.jqName[ 0 ].gsSample =
	this.jqWaveformWrapper[ 0 ].gsSample =
	this.jqWaveform[ 0 ].gsSample =
	this.jqCropEnd[ 0 ].gsSample = this;

	this.select( false );
	ui.CSS_sampleDuration( this );
	ui.CSS_sampleWaveform( this );
};
