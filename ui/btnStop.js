"use strict";

ui.initElement( "btnStop", function( el ) {
	return {
		click: gs.stop,
		stop: function() {
			ui.btnPlay.pause();
			ui.currentTimeCursor.at( 0 );
			ui.clock.setTime( 0 );
		}
	};
} );
