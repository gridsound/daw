"use strict";

( function() {

waFwk.analyser.fftSize = 256;
waFwk.analyserData = new Uint8Array( waFwk.analyser.frequencyBinCount );
waFwk.do.setBPM( 120 );

for ( var i = 0; i < 42; ++i ) {
	waFwk.do.addTrack( {} );
}

ui.trackHeight = waFwk.tracks[ 0 ].userData.elColNamesTrack.offsetHeight;
ui.visual.on();

} )();
