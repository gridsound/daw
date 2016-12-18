"use strict";

( function() {

document.body.addEventListener( "mousemove", function( e ) {
	if ( gsfileDragging ) {
		elItemDragging.style.left = e.pageX + "px";
		elItemDragging.style.top = e.pageY + "px";
	}
} );

document.body.addEventListener( "mouseup", function( e ) {
	if ( gsfileDragging ) {
		elItemDragging.remove();
		gsfileDragging = null;
		ui.cursor( "app", null );
	}
} );

ui.dom.gridColB.addEventListener( "mouseup", function( e ) {
	if ( gsfileDragging ) {
		gs.history.pushExec( "create", {
			sample: gs.sample.create( gsfileDragging ),
			track: ui.getTrackFromPageY( e.pageY ),
			when: ui.getGridSec( e.pageX )
		} );
	}
} );

gs.file.dragstart = function( that, e ) {
	if ( that.isLoaded && !gsfileDragging ) {
		gsfileDragging = that;
		elItemDragging = that.elFile.cloneNode( true );
		elItemDragging.style.left = e.pageX + "px";
		elItemDragging.style.top = e.pageY + "px";
		elItemDragging.classList.add( "dragging" );
		ui.dom.app.appendChild( elItemDragging );
		ui.cursor( "app", "grabbing" );
	}
	return false;
};

var gsfileDragging,
	elItemDragging;

} )();
