"use strict";

ui.jqBody.on( {
	dragover: false,
	drop: function( e ) {
		e = e.originalEvent;
		var data = e && e.dataTransfer;
		$.each( data && data.files, function() {
			if ( !this.type || this.type === "text/plain" ) {
				gs.reset();
				gs.load( this );
			} else {
				var that = this;

				if ( !gs.files.some( function( f ) {
					if ( f.fullname === that.name && f.savedSize === that.size ) {
						f.joinFile( that );
						return true;
					}
				} ) ) {
					gs.fileCreate( this );
				}
			}
		} );
		return false;
	}
} );
