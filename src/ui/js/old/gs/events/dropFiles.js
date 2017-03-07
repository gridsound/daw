"use strict";

( function() {

var saveFile, arrFiles;

document.body.ondragover = function() { return false; };
document.body.ondrop = function( e ) {
	var file,
		i = 0,
		data = e && e.dataTransfer;

	arrFiles = [];
	saveFile = false;

	// Chrome :
	if ( data.items && data.items.length ) {
		dataItems( data.items );

	// Firefox :
	} else {
		while ( file = data.files[ i++ ] ) {
			pushFile( file );
		}
		gs.compositions.readFile( saveFile ).then( loadFiles );
	}
	return false;
};

function loadFiles() {
	waFwk.do( "addSources", arrFiles.filter( function( file ) {
		return !waFwk.sources.some( function( srcobj ) {
			var ret = file.name === srcobj.metadata.filename &&
					file.size === srcobj.metadata.size;

			if ( ret && !srcobj.data ) {
				waFwk.do.fillSource( srcobj, file );
			}
			return ret;
		} );
	} ) );
}

function dataItems( droppedItems ) {
	var item, i = 0, arrayPromises = [];

	while ( item = droppedItems[ i++ ] ) {
		if ( item.webkitGetAsEntry &&
			( item = item.webkitGetAsEntry() )
		) {
			arrayPromises.push( traverseTree( item ) );
		} else if ( item = item.getAsFile() ) {
			lg("item.getAsFile()", item)
			pushFile( item );
		}
	}
	Promise.all( arrayPromises ).then( function() {
		gs.compositions.readFile( saveFile ).then( loadFiles );
	} );
}

function traverseTree( item ) {
	return new Promise( function( resolve ) {
		if ( item.isFile ) {
			item.file( function( file ) {
				pushFile( file );
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
		} else {
			resolve();
		}
	} );
}

function pushFile( file ) {
	switch ( /[^.]*.?([^.]*)$/.exec( file.name )[ 1 ].toLowerCase() ) {
		case "gs": case "txt": case "json":
			saveFile = file;
			gs.reset();
			break;
		case "mp3": case "mpg": case "mpeg":
		case "wav": case "wave":
		case "ogg":
			arrFiles.push( file );
	}
}

} )();
