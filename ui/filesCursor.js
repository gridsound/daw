"use strict";

ui.initElement( "filesCursor", function( el ) {
	return {
		remove: function() {
			el.remove();
		},
		insertInto: function( file ) {
			el.style.transitionDuration =
			el.style.left = 0;
			file.elWaveformWrap.appendChild( el );
		},
		startMoving: function( sec ) {
			el.style.transitionDuration = sec + "s";
			el.style.left = "100%";
		}
	};
} );
