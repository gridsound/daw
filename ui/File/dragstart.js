"use strict";

(function() {

var
	uifileDragging,
	jqWaveformTmp
;

ui.jqBody
	.mousemove( function( e ) {
		if ( uifileDragging ) {
			jqWaveformTmp.css( { left: e.pageX, top: e.pageY } );
		}
	})
	.mouseup( function( e ) {
		if ( uifileDragging ) {
			var
				trackId = Math.floor( ( e.pageY - ui.gridColsY - ui.gridTop ) / ui.gridEm ),
				xem = e.pageX - ui.filesWidth - ui.trackNamesWidth - ui.trackLinesLeft
			;
			xem /= ui.gridEm;
			jqWaveformTmp.remove();
			if ( trackId >= 0 && xem >= 0 ) {
				ui.unselectSamples();
				ui.selectSample( ui.newSample( uifileDragging, trackId, xem ), true );
			}
			uifileDragging = null;
		}
	})
;

ui.File.prototype.dragstart = function( e ) {
	if ( this.isLoaded && !uifileDragging ) {
		uifileDragging = this;
		jqWaveformTmp = this.jqCanvasWaveform.clone();
		var canvas = jqWaveformTmp[ 0 ];
		canvas.getContext( "2d" ).drawImage(
			this.jqCanvasWaveform[ 0 ],
			0, 0, canvas.width, canvas.height
		);
		jqWaveformTmp
			.addClass( "dragging" )
			.css( { left: e.pageX, top: e.pageY } )
			.appendTo( ui.jqBody )
		;
	}
	return false;
};

})();
