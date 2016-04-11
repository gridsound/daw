"use strict";

ui.File.prototype.loaded = function() {
	var that = this;

	this.isLoading = true;
	// webaudio.load( this.file, function( wbuffer ) {
		// that.wbuffer = wbuffer;
		that.isLoaded = true;
		that.isLoading = false;
		that.jqToLoad.remove();
		that.jqFile.removeClass( "to-load" );
		// wbuffer.play();
	// });
};
