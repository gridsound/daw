"use strict";


function extractData( droppedItems ) {
	function traverseTree( item ) {
		var p = new Promise( function( resolve ) {
			if ( item.isFile ) {
				item.file( function( file ) {
					if ( file.type && file.type !== "text/plain" ) {
						arrayFiles.push( file );
					} else if ( !saveFile ) {
						saveFile = file;
						gs.reset();
					}
					resolve();
				});
			} else if ( item.isDirectory ) {
				dirReader = item.createReader();
				dirReader.readEntries( function( files ) {
					var promArr = [];
					$.each( files, function() {
						promArr.push ( traverseTree( this ) );
					} );
					Promise.all( promArr )
					.then( function() {
						resolve();
					} );
				} );
			}
		} );
		return p;
	}

	var
		item,
		dirReader,
		saveFile,
		arrayFiles = [],
		arrayPromises = [];
	;

	$.each( droppedItems, function() {
		if ( item = this.webkitGetAsEntry() ) {
			arrayPromises.push ( traverseTree( item ) );
		}
	});
	Promise.all( arrayPromises )
		.then( function() {
			gs.load( saveFile )
			.then( function() {
				loadFile( arrayFiles );
			} );
	} );
}

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
		// Chrome
		if ( data.items ) {
			extractData( data.items );
		} else {
			if ( !data.files.length ) {
				// Folder detection for IE
				alerte( "Your browser doesn't support folders." );
			} else {
				$.each( data && data.files, function() {
					if ( this.type && this.type !== "text/plain" ) {
						droppedFiles.push( this );
					} else if ( !saveFile ) {
						saveFile = this;
						gs.reset();
					}
				} );
				gs.load( saveFile )
				.then( function() {
					loadFile( droppedFiles );
				} );
			}
		}
		return false;
	}
} );
