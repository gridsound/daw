"use strict";

ui.tracksBg = {
	_nb4emSave: 0,
	update: function() {
		ui.tracksBg._writeHtml( Math.ceil( ui.trackLinesWidth / ui.gridEm / 4 ) + 2 );
		ui.dom.tracksBg.firstChild.style.marginLeft =
			ui.trackLinesLeft / ui.gridEm % 8 + "em";
	},

	// private:
	_writeHtml: function( nb4em ) {
		var i, j, k, d1, d2,
			nb = nb4em - ui.tracksBg._nb4emSave;

		ui.tracksBg._nb4emSave = Math.max( nb4em, ui.tracksBg._nb4emSave );
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
	}
};
