"use strict";

( function() {

for ( var i = 0; i < 42; ++i ) {
	waFwk.do.addTrack( {} );
}

ui.trackHeight = waFwk.tracks[ 0 ].userData.elColNamesTrack.offsetHeight;

} )();
