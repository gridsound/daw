"use strict";

ui.initElement( "visual", function( el ) {
	var uiOsc = new gsuiOscilloscope( el.querySelector( ".gsuiOscilloscope" ) );

	uiOsc.setResolution( 256, el.clientHeight );
	uiOsc.setPinch( 1 );
	uiOsc.dataFunction( function() {
		waFwk.analyser.getByteTimeDomainData( waFwk.analyserData );
		return waFwk.analyserData;
	} );
	uiOsc.drawBegin( function( ctx, max, w, h ) {
		ctx.globalCompositeOperation = "source-in";
		ctx.fillStyle = "rgba(0,0,0,.8)";
		ctx.fillRect( 0, 0, w, h );
		ctx.globalCompositeOperation = "source-over";
	} );
	uiOsc.drawEnd( function( ctx, max ) {
		if ( max < .01 ) {
			ctx.strokeStyle = "rgba(0,0,0,0)";
		} else {
			ctx.strokeStyle = "#52666e";
			ctx.lineJoin = "round";
			ctx.lineWidth = 2;
		}
	} );

	return {
		on: uiOsc.startAnimation.bind( uiOsc ),
		off: uiOsc.stopAnimation.bind( uiOsc )
	};
} );
