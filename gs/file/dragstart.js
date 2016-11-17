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
		elWaveformTmp.remove();
		gsfileDragging = null;
		ui.cursor( "app", null );
	}
} );

ui.dom.gridColB.addEventListener( "mouseup", function( e ) {
	if ( gsfileDragging ) {
		var smp = gs.sample.create( gsfileDragging );

		gs.sample.inTrack( smp, ui.getTrackFromPageY( e.pageY ).id );
		gs.sample.when( smp, ui.getGridSec( e.pageX ) );
		wa.composition.add( smp );
	}
} );

gs.file.dragstart = function( that, e ) {
	if ( that.isLoaded && !gsfileDragging ) {
		gsfileDragging = that;
		elWaveformTmp = that.elSVG.cloneNode( true );
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

} )();
