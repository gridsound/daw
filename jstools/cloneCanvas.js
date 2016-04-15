"use strict";

function cloneCanvas( canvas ) {
	var newc = document.createElement( "canvas" );
	newc.width = canvas.width;
	newc.height = canvas.height;
	newc.getContext( "2d" ).drawImage( canvas, 0, 0 );
	return newc;
}
