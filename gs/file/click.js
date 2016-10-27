"use strict";

gs.file.click = function( that ) {
	if ( that.isLoaded ) {
		gs.file.play( that );
	} else if ( !that.file ) {
		if ( confirm( '"' + that.name + '" is missing...\nDo you want to browse your files to find it ?' ) ) {
			ui.filesInput.getFile( function( file ) {
				gs.file.joinFile( that, file );
			} );
		}
	} else if ( !that.isLoading ) {
		gs.file.load( that, gs.file.play );
	}
};
