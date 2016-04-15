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
		that.jqCanvasWaveform = $( wbuff.getWaveForm( 400, 50, "#39395A" ) )
			.addClass( "waveform" );
		that.jqFile.prepend( that.jqCanvasWaveform );
		ui.playFile( that );
	});
};
