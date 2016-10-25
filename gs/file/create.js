"use strict";

( function() {

var clickedFile;

ui.dom.filesInput.onchange = function() {
	if ( clickedFile ) {
		gs.file.joinFile( clickedFile, this.files[ 0 ] );
		clickedFile = null;
	}
};

gs.file.create = function( file ) {
	var that = {
			id: gs.files.length,
			isLoaded: false,
			isLoading: false,
			nbSamples: 0,
			samplesToSet: [],
			file: file.length ? null : file,
			bufferDuration: file.length ? file[ 3 ] : null,
			fullname: file.name || file[ 1 ],
		};

	that.name = that.fullname.replace( /\.[^.]+$/, "" );
	that.elFile = wisdom.cE( Handlebars.templates.file( that ) )[ 0 ];
	that.elName = wisdom.qS( that.elFile, ".name" );
	that.elIcon = wisdom.qS( that.elFile, ".icon" );
	if ( that.file ) {
		ui.CSS_fileUnloaded( that );
	} else {
		that.size = file[ 2 ];
		ui.CSS_fileWithoutData( that );
	}
	that.elFile.oncontextmenu = function() { return false; };
	that.elFile.ondragstart = gs.file.dragstart.bind( null, that );
	that.elFile.onmousedown = function( e ) {
		if ( e.button !== 0 ) {
			gs.file.stop();
		}
		if ( e.ctrlKey ) {
			gs.file.delete( that );
		}
	};
	that.elFile.onclick = function() {
		if ( that.isLoaded ) {
			gs.file.play( that );
		} else if ( !that.file ) {
			alert( "Choose the file to associate or drag and drop " + that.name );
			clickedFile = that;
			ui.dom.filesInput.click();
		} else if ( !that.isLoading ) {
			gs.file.load( that, gs.file.play );
		}
	};
	gs.files.push( that );
	ui.dom.filesList.appendChild( that.elFile );
	return that;
};

} )();
