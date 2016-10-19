"use strict";

ui.initElement( "btnStop", function( el ) {
	return {
		stop: function() {
			ui.btnPlay.pause();
			ui.currentTime( 0 );
		}
	};
} );
