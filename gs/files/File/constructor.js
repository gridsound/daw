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

	this.jqFile = $( "<a class='sample' draggable='true'>" );
	this.jqName = $( "<span>" + this.name + "</span>" );
	this.jqToLoad = $( "<i class='to-load fa fa-fw'>" );
	$( "<span class='name text-overflow'>" )
		.append( this.jqToLoad )
		.append( this.jqName )
		.appendTo( this.jqFile );

	if ( this.file ) {
		ui.CSS_fileToLoad( this );
	} else {
		this.savedSize = file[ 2 ];
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
