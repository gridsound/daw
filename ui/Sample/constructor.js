"use strict";

ui.Sample = function( uifile ) {
	var canvas, ctx, img;

	this.xemMagnet = 0;
	this.uifile = uifile;
	this.wbuff = uifile.wbuff;
	this.offsetEm = 0;
	this.wsample = this.wbuff.createSample();

	this.jqSample = $( "<div class='sample'>" );
	this.jqWaveformWrapper = $( "<div class='waveformWrapper'>" )
		.appendTo( this.jqSample );
	this.jqWaveform = $( "<canvas class='waveform'>" ).appendTo( this.jqWaveformWrapper );
	canvas = this.jqWaveform[ 0 ];
	ctx = canvas.getContext( "2d" );
	canvas.width = ~~( this.wbuff.buffer.duration * 300 );
	canvas.height = 50;
	img = ctx.createImageData( canvas.width, canvas.height );
	this.wbuff.drawWaveform( img, [ 0xDD, 0xDD, 0xFF, 0xFF ] );
	ctx.putImageData( img, 0, 0 );
	this.jqName = $( "<span class='text-overflow'>" )
		.text( uifile.name ).appendTo( this.jqSample );

	this.jqName[ 0 ].uisample =
	this.jqWaveformWrapper[ 0 ].uisample =
	this.jqWaveform[ 0 ].uisample = this;

	this.select( false );
};
