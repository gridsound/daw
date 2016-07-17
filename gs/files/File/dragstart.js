"use strict";

( function() {

var gsfileDragging,
	elWaveformTmp;

document.body.addEventListener( "mousemove", function( e ) {
	if ( gsfileDragging ) {
		ui.css( elWaveformTmp, "left", e.pageX + "px" );
		ui.css( elWaveformTmp, "top", e.pageY + "px" );
	}
} );

document.body.addEventListener( "mouseup", function( e ) {
	if ( gsfileDragging ) {
		var track = ui.getTrackFromPageY( e.pageY ),
			xem = ui.getGridXem( e.pageX );
		elWaveformTmp.remove();
		if ( track && xem >= 0 ) {
			gs.sampleCreate( gsfileDragging, track.id, xem );
		}
		gsfileDragging = null;
		ui.cursor( "app", null );
	}
} );

gs.File.prototype.dragstart = function( e ) {
	if ( this.isLoaded && !gsfileDragging ) {
		gsfileDragging = this;
		elWaveformTmp = this.elSVG.cloneNode( true );
		ui.css( elWaveformTmp, "left", e.pageX + "px" );
		ui.css( elWaveformTmp, "top", e.pageY + "px" );
		elWaveformTmp.classList.add( "dragging" );
		document.body.appendChild( elWaveformTmp );
		ui.cursor( "app", "grabbing" );
	}
	return false;
};

})();
