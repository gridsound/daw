"use strict";

gs.file.load = function( that, fn ) {
	that.isLoading = true;
	ui.file.loading( that );
	that.wbuff.setFile( that.file ).then( function( wbuff ) {
		that.isLoaded = true;
		that.isLoading = false;
		that.elSVG = wisdom.qS( that.elFile, "svg" );
		that.elWaveformWrap = that.elSVG.parentNode;
		wbuff.waveformSVG( that.elSVG, 400, 50 );
		ui.file.loaded( that );
		fn( that );
	}, function() {
		that.isLoading = false;
		ui.file.error( that );
		alert( "At this day, the file: \"" + that.fullname +
			"\" can not be decoded by your browser.\n" );
	} );
};
