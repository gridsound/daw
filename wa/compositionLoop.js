"use strict";

(function() {

var reqFrameId;

function frame() {
	ui.currentTime( wa.composition.currentTime() );
	reqFrameId = requestAnimationFrame( frame );
}

wa.compositionLoop = function( b ) {
	if ( b ) {
		frame();
	} else {
		cancelAnimationFrame( reqFrameId );
	}
};

})();
