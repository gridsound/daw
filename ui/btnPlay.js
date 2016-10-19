"use strict";

ui.initElement( "btnPlay", function( el ) {
	var reqFrameId;

	function frame() {
		var sec = wa.composition.currentTime();

		ui.currentTimeCursor.at( sec );
		ui.clock.setTime( sec );
		reqFrameId = requestAnimationFrame( frame );
	}

	return {
		play: function() {
			el.classList.remove( "play" );
			el.classList.add( "pause" );
			frame();
		},
		pause: function() {
			cancelAnimationFrame( reqFrameId );
			el.classList.remove( "pause" );
			el.classList.add( "play" );
		}
	};
} );
