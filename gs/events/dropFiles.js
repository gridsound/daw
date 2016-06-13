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
				var
					fileFound = false,
					that = this
				;
				// Can be optimized with a fileless uifile array and maybe use for
				ui.files.forEach( function( f, index ) {
					if ( f.fullname === that.name
						 && f.savedSize === that.size
						 && f.savedType === that.type ) {
						f.associate( that );
						fileFound = true;
					}
				});
				if ( !fileFound ) {
					ui.newFile( this );
				}
			}
		});
		return false;
	}
});
