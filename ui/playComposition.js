"use strict";

ui.playComposition = function( b ) {
	if ( typeof b !== "boolean" ) {
		b = !wa.composition.isPlaying;
	}
	if ( b ) {
		wa.composition.playFrom();
	} else {
		wa.composition.pause();
	}
	ui.jqPlay[ 0 ].classList.toggle( "fa-pause", b );
	ui.jqPlay[ 0 ].classList.toggle( "fa-play", !b );
	wa.compositionLoop( b );
};

ui.stopComposition = function() {
	wa.composition.stop();
	wa.compositionLoop( false );
	ui.setCurrentTime( 0 );
	ui.jqPlay[ 0 ].classList.remove( "fa-pause" );
	ui.jqPlay[ 0 ].classList.add( "fa-play" );
};
