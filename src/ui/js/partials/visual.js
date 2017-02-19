"use strict";

ui.visual = {
	on: function() {
		ui.visual._osc.startAnimation();
	},
	off: function() {
		ui.visual._osc.stopAnimation();
	},
	init: function() {
		var el = document.querySelector( "#visual" ),
			osc = new gsuiOscilloscope( el.querySelector( ".gsuiOscilloscope" ) );

		ui.visual._osc = osc;
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
	}
};
