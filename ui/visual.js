"use strict";

ui.initElement( "visual", function( el ) {
	var emptyArr = [],
		uiOsc = new gsuiOscilloscope( el.querySelector( ".gsuiOscilloscope" ) );

	uiOsc.setResolution( 256, el.clientHeight );
	uiOsc.setPinch( 1 );
	uiOsc.dataFunction( function() {
		var data = emptyArr;

		if ( gs.wctx.nbPlaying ) {
			gs.analyserNode.getByteTimeDomainData( data = gs.analyserData );
		}
		return data;
	} );

	return {
		on: uiOsc.startAnimation.bind( uiOsc ),
		off: uiOsc.stopAnimation.bind( uiOsc )
	};
} );
