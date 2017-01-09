"use strict";

gs.file.click = function( that ) {
	if ( that.isLoaded ) {
		gs.file.play( that );
	} else if ( !that.file ) {
		ui.gsuiPopup.open( "confirm", "Sample's data missing",
			"<code>" + that.name + "</code> is missing...<br/>" +
			"Do you want to browse your files to find it ?" )
		.then( function( b ) {
			if ( b ) {
				ui.filesInput.getFile( function( file ) {
					gs.file.joinFile( that, file );
				} );
			}
		} );
	} else if ( !that.isLoading ) {
		gs.file.load( that, gs.file.play );
	}
};
