"use strict";

gs.Sample = function( uifile ) {
	this.uifile = uifile;
	this.wbuff = uifile.wbuff;
	this.wsample = this.wbuff.createSample();

	this.jqSample = $( "<div class='sample'>" );
	this.jqWaveformWrapper = $( "<div class='waveformWrapper'>" )
		.appendTo( this.jqSample );
	this.jqWaveform = $( "<canvas class='waveform'>" ).appendTo( this.jqWaveformWrapper );
	this.jqName = $( "<span class='text-overflow'>" )
		.text( uifile.name ).appendTo( this.jqSample );

	this.canvas = this.jqWaveform[ 0 ];
	this.canvasCtx = this.canvas.getContext( "2d" );

	this.jqName[ 0 ].gsSample =
	this.jqWaveformWrapper[ 0 ].gsSample =
	this.jqWaveform[ 0 ].gsSample = this;

	this.select( false );
	ui.CSS_sampleWidth( this );
	ui.CSS_sampleWaveform( this );
};
