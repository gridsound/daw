"use strict";

ui.initElement( "btnPlay", function( el ) {
	var reqFrameId;

	function frame() {
		ui.currentTime( wa.composition.currentTime() );
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
