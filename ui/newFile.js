"use strict";

ui.newFile = function( obj ) {
	var file = new ui.File( obj );
	ui.files.push( file );
	ui.jqFilelist.append( file.jqFile );
};
