"use strict";

(function() {

var reqFrameId;

function frame() {
	ui.currentTime( wa.composition.currentTime() );
	reqFrameId = requestAnimationFrame( frame );
}

ui.play = function() {
	ui.elPlay.classList.remove( "play" );
	ui.elPlay.classList.add( "pause" );
	frame();
};

ui.pause = function() {
	cancelAnimationFrame( reqFrameId );
	ui.elPlay.classList.remove( "pause" );
	ui.elPlay.classList.add( "play" );
};

ui.stop = function() {
	ui.pause();
	ui.currentTime( 0 );
};

})();
