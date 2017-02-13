"use strict";

( function() {

var reqFrameId,
	btnPlay = ui.dom.btnPlay,
	btnStop = ui.dom.btnStop;

btnPlay.onclick = gs.playPause;
btnStop.onclick = gs.stop;

waFwk.on.play = function() {
	btnPlay.classList.remove( "play" );
	btnPlay.classList.add( "pause" );
	frame();
};

waFwk.on.pause = function() {
	cancelAnimationFrame( reqFrameId );
	btnPlay.classList.remove( "pause" );
	btnPlay.classList.add( "play" );
};

waFwk.on.stop = function() {
	waFwk.on.pause();
	ui.currentTimeCursor.at( 0 );
	ui.clockSetTime( 0 );
};

function frame() {
	var sec = gs.composition.currentTime();

	ui.currentTimeCursor.at( sec );
	ui.clockSetTime( sec );
	reqFrameId = requestAnimationFrame( frame );
}

} )();
