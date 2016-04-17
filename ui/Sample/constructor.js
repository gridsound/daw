"use strict";

ui.Sample = function( uifile ) {
	this.uifile = uifile;
	this.wbuff = uifile.wbuff;

	this.jqSample = $( "<div class='sample'>" );
	this.jqWaveformWrapper = $( "<div class='waveformWrapper'>" )
		.appendTo( this.jqSample );
	this.jqWaveform = $( this.wbuff.getWaveForm(
		~~( this.wbuff.buffer.duration * 300 ), 50, "#ddf"
	)).addClass( "waveform" ).appendTo( this.jqWaveformWrapper );
	this.jqName = $( "<span class='text-overflow'>" )
		.text( uifile.name ).appendTo( this.jqSample );

	this.jqName[ 0 ].uisample = this;
	this.jqWaveform[ 0 ].uisample = this;
};
