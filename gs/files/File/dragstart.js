"use strict";

( function() {

document.body.addEventListener( "mousemove", function( e ) {
	if ( gsfileDragging ) {
		wisdom.css( elWaveformTmp, "left", e.pageX + "px" );
		wisdom.css( elWaveformTmp, "top", e.pageY + "px" );
	}
} );

document.body.addEventListener( "mouseup", function( e ) {
	if ( gsfileDragging ) {
		var track = ui.getTrackFromPageY( e.pageY ),
			sec = ui.getGridSec( e.pageX );
		elWaveformTmp.remove();
		if ( track && sec >= 0 ) {
			gs.sampleCreate( gsfileDragging, track.id, sec );
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

var gsfileDragging,
	elWaveformTmp;

})();
