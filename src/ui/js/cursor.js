"use strict";

( function() {

var gridsave = null;

function setCur( el, c ) {
	if ( c ) {
		el.dataset.cursor = c;
	} else {
		el.removeAttribute( "data-cursor" );
	}
}

ui.cursor = function( el, cur ) {
	if ( el === "app" ) {
		setCur( ui.dom.app, cur );
		setCur( ui.dom.tracksLines, cur ? null : gridsave );
	} else {
		setCur( ui.dom.tracksLines, gridsave = cur );
	}
};

} )();
