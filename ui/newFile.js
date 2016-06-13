"use strict";

ui.newFile = function( obj ) {
	var uifile = new ui.File( obj );
	ui.files.push( uifile );
	ui.jqFilelist.append( uifile.jqFile );
	return uifile;
};
