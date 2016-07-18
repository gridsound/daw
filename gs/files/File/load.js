"use strict";

gs.File.prototype.load = function( fn ) {
	var that = this;

	this.isLoading = true;
	ui.CSS_fileLoading( this );

	wa.wctx.createBuffer( this.file ).then( function( wbuff ) {
		that.wbuff = wbuff;
		that.isLoaded = true;
		that.isLoading = false;
		that.elSVG = that.elFile.querySelector( "svg" );
		that.elWaveformWrap = that.elSVG.parentNode;
		wbuff.waveformSVG( that.elSVG, 400, 50 );
		ui.CSS_fileLoaded( that );
		fn( that );
	}, function() {
		that.isLoading = false;
		ui.CSS_fileError( that );
		alert( "At this day, the file: \"" + that.fullname +
			"\" can not be decoded by your browser.\n" );
	} );
};
