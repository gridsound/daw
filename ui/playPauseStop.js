"use strict";

(function() {

var reqFrameId;

function frame() {
	ui.currentTime( wa.composition.currentTime() );
	reqFrameId = requestAnimationFrame( frame );
}

ui.play = function() {
	ui.jqPlay[ 0 ].classList.remove( "fa-play" );
	ui.jqPlay[ 0 ].classList.add( "fa-pause" );
	frame();
};

ui.pause = function() {
	cancelAnimationFrame( reqFrameId );
	ui.jqPlay[ 0 ].classList.remove( "fa-pause" );
	ui.jqPlay[ 0 ].classList.add( "fa-play" );
};

ui.stop = function() {
	ui.pause();
	ui.currentTime( 0 );
};

})();
