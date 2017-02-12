"use strict";

ui.initElement( "filesInput", function( el ) {
	var callback;

	return {
		change: function() {
			callback( el.files[ 0 ] );
		},
		getFile: function( fn ) {
			callback = fn;
			el.click();
		}
	};
} );
