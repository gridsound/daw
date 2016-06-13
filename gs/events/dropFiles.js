"use strict";

ui.jqBody.on( {
	dragover: false,
	drop: function( e ) {
		e = e.originalEvent;
		var data = e && e.dataTransfer;
		$.each( data && data.files, function() {
			if ( !this.type || this.type === "text/plain" ) {
				// FIX ME : ResetAll
				gs.load( this );
			} else {
				ui.newFile( this );
			}
		});
		return false;
	}
});
