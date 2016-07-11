"use strict";

( function() {

var gridsave = null;

function setCur( jq, c ) { jq.attr( "data-cursor", c ); }

ui.cursor = function( el, cur ) {
	if ( el === "app" ) {
		setCur( ui.jqApp, cur );
		setCur( ui.jqTrackLines, cur ? null : gridsave );
	} else {
		setCur( ui.jqTrackLines, gridsave = cur );
	}
};

} )();
