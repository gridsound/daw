"use strict";

(function() {

var reqFrameId,
	nbLoops;

function frame() {
	if ( --nbLoops > 0 ) {
		var sec = wa.composition.getOffset();
		ui.setClockTime( sec );
		ui.setCursorTime( sec );
		reqFrameId = requestAnimationFrame( frame );
	}
}

wa.compositionLoop = function( b ) {
	if ( b ) {
		nbLoops = Infinity;
		frame();
	} else {
		nbLoops = 2;
	}
};

})();
