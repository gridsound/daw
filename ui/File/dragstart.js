"use strict";

(function() {

var jqWaveformTmp;

ui.jqBody
	.mousemove( function( e ) {
		if ( jqWaveformTmp ) {
			jqWaveformTmp.css( { left: e.pageX, top: e.pageY } );
		}
	})
	.mouseup( function( e ) {
		if ( jqWaveformTmp ) {
			jqWaveformTmp = null;
		}
	})
;

ui.File.prototype.dragstart = function( e ) {
	if ( this.isLoaded && !jqWaveformTmp ) {
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
