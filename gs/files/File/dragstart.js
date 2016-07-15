"use strict";

( function() {

var gsfileDragging,
	jqWaveformTmp;

ui.jqBody
	.mousemove( function( e ) {
		if ( gsfileDragging ) {
			ui.css( jqWaveformTmp[ 0 ], "left", e.pageX + "px" );
			ui.css( jqWaveformTmp[ 0 ], "top", e.pageY + "px" );
		}
	} )
	.mouseup( function( e ) {
		if ( gsfileDragging ) {
			var track = ui.getTrackFromPageY( e.pageY ),
				xem = ui.getGridXem( e.pageX );
			jqWaveformTmp.remove();
			if ( track && xem >= 0 ) {
				gs.sampleCreate( gsfileDragging, track.id, xem );
			}
			gsfileDragging = null;
		}
	} );

gs.File.prototype.dragstart = function( e ) {
	if ( this.isLoaded && !gsfileDragging ) {
		gsfileDragging = this;
		jqWaveformTmp = this.jqCanvasWaveform.clone();
		var canvas = jqWaveformTmp[ 0 ];
		canvas.getContext( "2d" ).drawImage(
			this.jqCanvasWaveform[ 0 ],
			0, 0, canvas.width, canvas.height
		);
		ui.css( jqWaveformTmp[ 0 ], "left", e.pageX + "px" );
		ui.css( jqWaveformTmp[ 0 ], "top", e.pageY + "px" );
		jqWaveformTmp
			.addClass( "dragging" )
			.appendTo( ui.jqBody )
		;
	}
	return false;
};

})();
