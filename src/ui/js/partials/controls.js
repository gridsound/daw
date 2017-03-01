"use strict";

ui.controls = {
	init: function() {
		ui.dom.btnPlay.onclick = gs.playPause;
		ui.dom.btnStop.onclick = gs.stop;
	},
	play: function() {
		ui.dom.btnPlay.classList.remove( "play" );
		ui.dom.btnPlay.classList.add( "pause" );
		ui.controls._frame();
	},
	pause: function() {
		cancelAnimationFrame( ui.controls._reqFrameId );
		ui.dom.btnPlay.classList.remove( "pause" );
		ui.dom.btnPlay.classList.add( "play" );
	},
	stop: function() {
		waFwk.on.pause();
		ui.timeline.currentTime( 0 );
		ui.clock.currentTime( 0 );
	},

	// private:
	_frame: function() {
		var sec = gs.composition.currentTime();

		ui.timeline.currentTime( sec );
		ui.clock.currentTime( sec );
		ui.controls._reqFrameId = requestAnimationFrame( ui.controls._frame );
	}
};
