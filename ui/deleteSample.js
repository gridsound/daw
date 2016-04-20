"use strict";

ui.deleteSample = function( uisample ) {
	if ( uisample ) {
		var i = ui.samples.indexOf( uisample );
		ui.samples.splice( i, 1 );
		uisample.delete();
	}
};
