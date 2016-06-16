"use strict";

ui.File.prototype.loaded = function( fn ) {
	var that = this;

	this.isLoading = true;
	this.jqToLoad.removeClass( "fa-downloads" )
		.addClass( "fa-refresh fa-spin" );

	wa.wctx.createBuffer( this.file, function( wbuff ) {
		var canvas, ctx, img;

		that.wbuff = wbuff;
		that.isLoaded = true;
		that.isLoading = false;
		that.jqFile.removeClass( "to-load" );
		that.jqToLoad.remove();
		that.jqCanvasWaveform = $( "<canvas class='waveform'>" );
		canvas = that.jqCanvasWaveform[ 0 ];
		ctx = canvas.getContext( "2d" );
		canvas.width = 400;
		canvas.height = 50;
		img = ctx.createImageData( canvas.width, canvas.height );
		wbuff.drawWaveform( img, [ 0x39, 0x39, 0x5A, 0xFF ] )
		ctx.putImageData( img, 0, 0 );
		that.jqFile.prepend( canvas );
		ui.playFile( that );
		if ( fn )
			fn();
	});
};
