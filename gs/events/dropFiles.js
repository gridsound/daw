"use strict";

function loadFile( droppedFiles ) {
	droppedFiles.forEach( function( file ) {
		if ( !gs.files.some( function( f ) {
			var size = f.file ? f.file.size : f.size;
			if ( f.fullname === file.name && size === file.size ) {
				if ( !f.file ) {
					f.joinFile( file );
				}
				return true;
			}
		} ) ) {
			gs.fileCreate( file );
		}
	} );
}

ui.jqBody.on( {
	dragover: false,
	drop: function( e ) {
		e = e.originalEvent;
		var data = e && e.dataTransfer,
			saveFile = false,
			droppedFiles = [];
		$.each( data && data.files, function() {
			if ( this.type && this.type !== "text/plain" ) {
				droppedFiles.push( this );
			} else {
				saveFile = this;
				gs.reset();
			}
		} );
		gs.load( saveFile )
		.then( function() {
			loadFile( droppedFiles );
		} );
		return false;
	}
} );
