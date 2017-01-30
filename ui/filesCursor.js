"use strict";

ui.initElement( "filesCursor", function( el ) {
	return {
		remove: function() {
			el.remove();
		},
		insertInto: function( source ) {
			el.style.transitionDuration =
			el.style.left = 0;
			source.elRoot.appendChild( el );
		},
		startMoving: function( sec ) {
			el.style.transitionDuration = sec + "s";
			el.style.left = "100%";
		}
	};
} );
