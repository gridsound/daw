"use strict";

ui.File = function( file ) {
	var that = this;

	this.isLoaded =
	this.isLoading = false;
	this.file = file;
	this.fullname = file.name;
	this.name = file.name.replace( /\.[^.]+$/, "" );

	this.jqFile = $( "<a class='file to-load'>" );
	this.jqImgWaveform = $( "<div>" ).appendTo( this.jqFile );
	this.jqName = $( "<span class='text-overflow'>" )
		.appendTo( this.jqFile )
		.text( this.name );
	this.jqToLoad = $( "<i class='to-load fa fa-download'>" ).prependTo( this.jqName );

	this.jqFile.click( function() {
		if ( that.isLoaded ) {
			// webaudio.play( that.file );
		} else if ( !that.isLoading ) {
			that.loaded();
		}
	});
};
