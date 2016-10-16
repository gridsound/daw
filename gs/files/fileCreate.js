"use strict";

gs.fileCreate = function( obj ) {
	var gsfile = new gs.File( obj );
	gsfile.id = gs.files.length;
	gs.files.push( gsfile );
	ui.dom.filesList.appendChild( gsfile.elFile );
	return gsfile;
};
