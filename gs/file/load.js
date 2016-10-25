"use strict";

gs.file.load = function( that, fn ) {
	that.isLoading = true;
	ui.CSS_fileLoading( that );
	wa.wctx.createBuffer( that.file ).then( function( wbuff ) {
		that.wbuff = wbuff;
		that.isLoaded = true;
		that.isLoading = false;
		that.elSVG = wisdom.qS( that.elFile, "svg" );
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
