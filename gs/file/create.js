"use strict";

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
		ui.file.unloaded( that );
	} else {
		that.size = file[ 2 ];
		ui.file.withoutData( that );
	}
	that.elFile.onclick = gs.file.click.bind( null, that );
	that.elFile.ondragstart = gs.file.dragstart.bind( null, that );
	that.elFile.oncontextmenu = function() { return false; };
	that.elFile.onmousedown = function( e ) {
		if ( e.button !== 0 ) {
			gs.file.stop();
		}
		if ( e.ctrlKey ) {
			gs.file.delete( that );
		}
	};
	gs.files.push( that );
	ui.dom.filesList.appendChild( that.elFile );
	return that;
};
