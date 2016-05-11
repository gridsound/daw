"use strict";

(function() {

var reqFrameId;

function frame() {
	ui.setCurrentTime( wa.composition.getOffset() );
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
