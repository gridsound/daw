"use strict";

ui.visualOn = function() {
	ui.visualOsc.startAnimation();
};

ui.visualOff = function() {
	ui.visualOsc.stopAnimation();
};

ui.visualInit = function() {
	var el = document.querySelector( "#visual" ),
		osc = new gsuiOscilloscope( el.querySelector( ".gsuiOscilloscope" ) );

	ui.visual = el;
	ui.visualOsc = osc;
	osc.setResolution( 256, el.clientHeight );
	osc.setPinch( 1 );
	osc.dataFunction( function() {
		waFwk.analyser.getByteTimeDomainData( waFwk.analyserData );
		return waFwk.analyserData;
	} );
	osc.drawBegin( function( ctx, max, w, h ) {
		ctx.globalCompositeOperation = "source-in";
		ctx.fillStyle = "rgba(0,0,0,.8)";
		ctx.fillRect( 0, 0, w, h );
		ctx.globalCompositeOperation = "source-over";
	} );
	osc.drawEnd( function( ctx, max ) {
		if ( max < .01 ) {
			ctx.strokeStyle = "rgba(0,0,0,0)";
		} else {
			ctx.strokeStyle = "#52666e";
			ctx.lineJoin = "round";
			ctx.lineWidth = 2;
		}
	} );
};
