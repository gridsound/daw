"use strict";

ui.Sample = function( uifile ) {
	this.uifile = uifile;
	this.wbuff = uifile.wbuff;
	this.jqSample = $( "<div class='sample'>" );
	this.jqWaveform = $( cloneCanvas( uifile.jqCanvasWaveform[ 0 ] ) )
		.addClass( "waveform" ).appendTo( this.jqSample );
	this.jqName = $( "<span class='text-overflow'>" )
		.text( uifile.name ).appendTo( this.jqSample );
};
