"use strict";

(function() {

var reqFrameId;

function frame() {
	ui.currentTime( wa.composition.currentTime() );
	reqFrameId = requestAnimationFrame( frame );
}

ui.play = function() {
	ui.dom.btnPlay.classList.remove( "play" );
	ui.dom.btnPlay.classList.add( "pause" );
	frame();
};

ui.pause = function() {
	cancelAnimationFrame( reqFrameId );
	ui.dom.btnPlay.classList.remove( "pause" );
	ui.dom.btnPlay.classList.add( "play" );
};

ui.stop = function() {
	ui.pause();
	ui.currentTime( 0 );
};

})();
