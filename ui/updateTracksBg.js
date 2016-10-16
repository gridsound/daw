"use strict";

( function() {

ui.updateTracksBg = function() {
	writeHtml( Math.ceil( ui.trackLinesWidth / ui.gridEm / 4 ) + 2 );
	wisdom.css( elFirstDiv, "marginLeft", ( ui.trackLinesLeft / ui.gridEm % 8 ) + "em" );
};

var elFirstDiv,
	nb4emSave = 0;

function writeHtml( nb4em ) {
	var i, j, k, d1, d2,
		nb = nb4em - nb4emSave;

	nb4emSave = Math.max( nb4em, nb4emSave );
	for ( i = 0; i < nb; ++i ) {
		d1 = document.createElement( "div" );
		for ( j = 0; j < 4; ++j ) {
			d2 = document.createElement( "div" );
			for ( k = 0; k < 4; ++k ) {
				d2.appendChild( document.createElement( "div" ) );
			}
			d1.appendChild( d2 );
		}
		ui.dom.tracksBg.appendChild( d1 );
	}
	elFirstDiv = elFirstDiv || ui.dom.tracksBg.firstChild;
};

} )();
