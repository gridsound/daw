"use strict";

( function() {

var clickedFile;

ui.elInputFile.onchange = function() {
	if ( clickedFile ) {
		clickedFile.joinFile( this.files[ 0 ] );
		clickedFile = null;
	}
};

gs.File = function( file ) {
	var that = this;

	this.isLoaded =
	this.isLoading = false;
	this.file = file.length ? null : file;
	this.fullname = file.name || file[ 1 ];
	this.name = this.fullname.replace( /\.[^.]+$/, "" );
	this.nbSamples = 0;

	this.elFile = wisdom.cE( Handlebars.templates.file( this ) )[ 0 ];
	this.elName = wisdom.qS( this.elFile, ".name" );
	this.elIcon = wisdom.qS( this.elFile, ".icon" );

	if ( this.file ) {
		ui.CSS_fileUnloaded( this );
	} else {
		this.size = file[ 2 ];
		ui.CSS_fileWithoutData( this );
	}

	this.elFile.oncontextmenu = function() { return false; };
	this.elFile.ondragstart = this.dragstart.bind( this );
	this.elFile.onmousedown = function( e ) {
		if ( e.button !== 0 ) {
			gs.fileStop();
		}
	};
	this.elFile.onclick = function() {
		if ( that.isLoaded ) {
			gs.filePlay( that );
		} else if ( !that.file ) {
			alert( "Choose the file to associate or drag and drop " + that.name );
			clickedFile = that;
			ui.elInputFile.click();
		} else if ( !that.isLoading ) {
			that.load( gs.filePlay );
		}
	};
};

} )();
