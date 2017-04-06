"use strict";

ui.controls = {
	init: function() {
		ui.dom.btnStop.onclick = waFwk.stop.bind( waFwk );
		ui.dom.btnPlay.onclick = function() {
			waFwk.isPlaying ? waFwk.pause() : waFwk.play();
			return false;
		};
	},
	play: function() {
		ui.dom.btnPlay.classList.remove( "play" );
		ui.dom.btnPlay.classList.add( "pause" );
	},
	stop: function() {
		ui.dom.btnPlay.classList.remove( "pause" );
		ui.dom.btnPlay.classList.add( "play" );
	}
};
