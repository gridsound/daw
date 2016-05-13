"use strict";

ui.play = function() {
	ui.jqPlay[ 0 ].classList.remove( "fa-play" );
	ui.jqPlay[ 0 ].classList.add( "fa-pause" );
};

ui.pause = function() {
	ui.jqPlay[ 0 ].classList.remove( "fa-pause" );
	ui.jqPlay[ 0 ].classList.add( "fa-play" );
};

ui.stop = function() {
	ui.currentTime( 0 );
	ui.pause();
};
