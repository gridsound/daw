"use strict";

( function() {

document.body.ondragover = function() { return false; };
document.body.ondrop = function( e ) {
	var data = e && e.dataTransfer,
		saveFile = false,
		droppedFiles = [];

	// Chrome :
	if ( data.items ) {
		extractData( data.items );

	// IE :
	} else if ( !data.files.length ) {
		alerte( "Your browser doesn't support folders." );

	// Firefox :
	} else {
		var f, i = 0;
		while ( f = data.files[ i++ ] ) {
			if ( f.type && f.type !== "text/plain" ) {
				droppedFiles.push( f );
			} else if ( !saveFile ) {
				saveFile = f;
				gs.reset();
			}
		}
		gs.load( saveFile ).then( function() {
			loadFiles( droppedFiles );
		} );
	}
	return false;
};

var saveFile, arrFiles = [];

function traverseTree( item ) {
	return new Promise( function( resolve ) {
		if ( item.isFile ) {
			item.file( function( file ) {
				if ( file.type && file.type !== "text/plain" ) {
					arrFiles.push( file );
				} else if ( !saveFile ) {
					saveFile = file;
					gs.reset();
				}
				resolve();
			} );
		} else if ( item.isDirectory ) {
			var dirReader = item.createReader();
			dirReader.readEntries( function( files ) {
				var promArr = [];
				files.forEach( function( f ) {
					promArr.push( traverseTree( f ) );
				} );
				Promise.all( promArr ).then( resolve );
			} );
		}
	} );
}

function extractData( droppedItems ) {
	var item, i = 0, arrayPromises = [];

	while ( item = droppedItems[ i++ ] ) {
		if ( item = item.webkitGetAsEntry() ) {
			arrayPromises.push( traverseTree( item ) );
		}
	}
	Promise.all( arrayPromises ).then( function() {
		gs.load( saveFile ).then( function() {
			loadFiles( arrFiles );
		} );
	} );
}

function loadFiles( droppedFiles ) {
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

} )();
