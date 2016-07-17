"use strict";

(function() {

var reqFrameId;

function frame() {
	ui.currentTime( wa.composition.currentTime() );
	reqFrameId = requestAnimationFrame( frame );
}

ui.play = function() {
	ui.elPlay.classList.remove( "fa-play" );
	ui.elPlay.classList.add( "fa-pause" );
	frame();
};

ui.pause = function() {
	cancelAnimationFrame( reqFrameId );
	ui.elPlay.classList.remove( "fa-pause" );
	ui.elPlay.classList.add( "fa-play" );
};

ui.stop = function() {
	ui.pause();
	ui.currentTime( 0 );
};

})();
