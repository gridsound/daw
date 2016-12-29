"use strict";

ui.initElement( "tracksBg", function( el ) {
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
			el.appendChild( d1 );
		}
		elFirstDiv = elFirstDiv || el.firstChild;
	};

	return {
		update: function() {
			writeHtml( Math.ceil( ui.trackLinesWidth / ui.gridEm / 4 ) + 2 );
			elFirstDiv.style.marginLeft = ui.trackLinesLeft / ui.gridEm % 8 + "em";
		}
	};
} );
