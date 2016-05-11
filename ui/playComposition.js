"use strict";

ui.playComposition = function( b ) {
	if ( typeof b !== "boolean" ) {
		b = !wa.composition.isPlaying;
	}
	if ( b ) {
		var sec = wa.composition.pausedOffset;
		wa.composition.loadSamples( sec );
		wa.composition.playSamples( sec );
	} else {
		wa.composition.pauseSamples();
	}
	ui.jqPlay[ 0 ].classList.toggle( "fa-pause", b );
	ui.jqPlay[ 0 ].classList.toggle( "fa-play", !b );
	wa.compositionLoop( b );
};

ui.stopComposition = function() {
	if ( wa.composition.isPlaying ) { // TODO: prevent the infinite loop with .stopSamples
		wa.composition.stopSamples();
	}
	wa.compositionLoop( false );
	ui.setCurrentTime( 0 );
	ui.jqPlay[ 0 ].classList.remove( "fa-pause" );
	ui.jqPlay[ 0 ].classList.add( "fa-play" );
};
