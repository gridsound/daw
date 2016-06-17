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
				var fileFound = false,
					that = this;

				ui.files.forEach( function( f, index ) {
						console.log(f, that);
					if ( f.fullname === that.name
						 && f.savedSize === that.size ) {
						f.joinFile( that );
						fileFound = true;
					}
				});
				if ( !fileFound ) {
					gs.files.push( ui.newFile( this ) );
				}
			}
		});
		return false;
	}
} );
