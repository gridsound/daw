"use strict";

waFwk.on.playSource = function( srcObj ) {
	var elCursor = ui.dom.filesCursor,
		usrDat = srcObj.userData,
		bufDur = srcObj.bufferSample.duration;

	elCursor.style.transitionDuration =
	elCursor.style.left = 0;
	usrDat.elRoot.appendChild( elCursor );
	setTimeout( function() {
		elCursor.style.transitionDuration = bufDur + "s";
		elCursor.style.left = "100%";
	}, 20 );
};
