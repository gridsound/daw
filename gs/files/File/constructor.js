"use strict";

( function() {

var clickedFile;

ui.jqInputFile.change( function() {
	if ( clickedFile ) {
		clickedFile.joinFile( this.files[ 0 ] );
		clickedFile = null;
	}
} );

gs.File = function( file ) {
	var that = this;

	this.isLoaded =
	this.isLoading = false;
	this.file = file.length ? null : file;
	this.fullname = file.name || file[ 1 ];
	this.name = this.fullname.replace( /\.[^.]+$/, "" );

	this.jqFile = $( Handlebars.templates.file( this ) );
	this.jqToLoad = this.jqFile.find( ".to-load" );
	this.jqName = this.jqFile.find( ".name" );

	if ( this.file ) {
		ui.CSS_fileToLoad( this );
	} else {
		this.size = file[ 2 ];
		ui.CSS_fileWithoutData( this );
	}

	this.jqFile.on( {
		contextmenu: false,
		dragstart: this.dragstart.bind( this ),
		mousedown: function( e ) {
			if ( e.button !== 0 ) {
				gs.fileStop();
			}
		},
		click: function() {
			if ( that.isLoaded ) {
				gs.filePlay( that );
			} else if ( !that.file ) {
				alert( "Choose the file to associate or drag and drop " + that.name );
				clickedFile = that;
				ui.jqInputFile.click();
			} else if ( !that.isLoading ) {
				that.load( gs.filePlay );
			}
		}
	} );
};

} )();
