"use strict";

ui.initElement( "visualCanvas", function( canvas ) {
	var animId,
		emptyArr = [],
		ctxCanvas = canvas.getContext( "2d" );

	function frame() {
		var data = emptyArr;

		if ( wa.wctx.nbPlaying ) {
			data = wa.analyserArray;
			wa.analyser.getByteTimeDomainData( data );
		}
		wa.oscilloscope( canvas, ctxCanvas, data );
		animId = requestAnimationFrame( frame );
	}

	return {
		on: function() {
			animId = requestAnimationFrame( frame );
		},
		off: function() {
			cancelAnimationFrame( animId );
			ctxCanvas.clearRect( 0, 0, canvas.width, canvas.height );
		}
	};
} );
