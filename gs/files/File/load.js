"use strict";

gs.File.prototype.load = function( fn ) {
	var that = this;

	this.isLoading = true;
	ui.CSS_fileLoading( this );

	wa.wctx.createBuffer( this.file ).then( function( wbuff ) {
		var canvas, ctx, img;

		that.wbuff = wbuff;
		that.isLoaded = true;
		that.isLoading = false;
		ui.CSS_fileLoaded( that );
		that.jqCanvasWaveform = $( "<canvas class='waveform'>" );
		canvas = that.jqCanvasWaveform[ 0 ];
		ctx = canvas.getContext( "2d" );
		canvas.width = 400;
		canvas.height = 50;
		img = ctx.createImageData( canvas.width, canvas.height );
		wbuff.drawWaveform( img, [ 0x39, 0x39, 0x5A, 0xFF ] );
		ctx.putImageData( img, 0, 0 );
		that.jqFile.prepend( canvas );
		fn( that );
	}, function() {
		that.isLoading = false;
		ui.CSS_fileError( that );
		alert( "At this day, the file: \"" + that.fullname +
			"\" can not be decoded by your browser.\n" );
	} );
};
