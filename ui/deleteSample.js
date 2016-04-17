"use strict";

ui.deleteSample = function( uisample ) {
	var i = ui.samples.indexOf( uisample );
	if ( i >= 0 ) {
		ui.samples.splice( i, 1 );
	}
	uisample.delete();
};
