"use strict";

( function() {

var gsfileDragging,
	elWaveformTmp;

function createAction( gsfileDragging, trackId, xem ) {
	var s = gs.sampleCreate( gsfileDragging, trackId, xem );
	s.oldTrack = s.track;
	s.oldSelected = false;
	gs.history.push( {
		action: {
			func: gs.history.insertSample,
			samples: [ s ]
		},
		undo: {
			func: gs.history.undoInsertSample,
			samples: [ s ]
		}
	} );
	return s;
}

document.body.addEventListener( "mousemove", function( e ) {
	if ( gsfileDragging ) {
		wisdom.css( elWaveformTmp, "left", e.pageX + "px" );
		wisdom.css( elWaveformTmp, "top", e.pageY + "px" );
	}
} );

document.body.addEventListener( "mouseup", function( e ) {
	if ( gsfileDragging ) {
		var track = ui.getTrackFromPageY( e.pageY ),
			xem = ui.getGridXem( e.pageX );
		elWaveformTmp.remove();
		if ( track && xem >= 0 ) {
			createAction( gsfileDragging, track.id, xem );
		}

		gsfileDragging = null;
		ui.cursor( "app", null );
	}
} );

gs.File.prototype.dragstart = function( e ) {
	if ( this.isLoaded && !gsfileDragging ) {
		gsfileDragging = this;
		elWaveformTmp = this.elSVG.cloneNode( true );
		wisdom.css( elWaveformTmp, "left", e.pageX + "px" );
		wisdom.css( elWaveformTmp, "top", e.pageY + "px" );
		elWaveformTmp.classList.add( "dragging" );
		document.body.appendChild( elWaveformTmp );
		ui.cursor( "app", "grabbing" );
	}
	return false;
};

})();
