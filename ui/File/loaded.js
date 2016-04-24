"use strict";

ui.File.prototype.loaded = function() {
	var that = this;

	this.isLoading = true;
	this.jqToLoad.removeClass( "fa-downloads" )
		.addClass( "fa-refresh fa-spin" );

	wa.wctx.createBuffer( this.file, function( wbuff ) {
		that.wbuff = wbuff;
		that.isLoaded = true;
		that.isLoading = false;
		that.jqFile.removeClass( "to-load" );
		that.jqToLoad.remove();
		that.jqCanvasWaveform = $( "<canvas class='waveform'>" );
		var canvas = that.jqCanvasWaveform[ 0 ];
		canvas.width = 400;
		canvas.height = 50;
		that.jqFile.prepend( wbuff.drawWaveform( canvas, [ 0x39, 0x39, 0x5A, 0xFF ] ) );
		ui.playFile( that );
	});
};
