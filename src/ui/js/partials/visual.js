"use strict";

ui.visual = {
	init: function() {
		var osc = new gsuiOscilloscope( ui.dom.visual.querySelector( ".gsuiOscilloscope" ) );

		ui.visual._osc = osc;
		osc.setResolution( 256, ui.dom.visual.clientHeight );
		osc.setPinch( 1 );
		osc.drawBegin( ui.visual._drawBegin );
		osc.drawEnd( ui.visual._drawEnd );
	},
	draw: function() {
		waFwk.analyser.getByteTimeDomainData( waFwk.analyserData );
		ui.visual._osc.draw( waFwk.analyserData );
	},

	// private:
	_drawBegin: function( ctx, max, w, h ) {
		ctx.globalCompositeOperation = "source-in";
		ctx.fillStyle = "rgba(0,0,0,.8)";
		ctx.fillRect( 0, 0, w, h );
		ctx.globalCompositeOperation = "source-over";
	},
	_drawEnd: function( ctx, max ) {
		if ( max < .01 ) {
			ctx.strokeStyle = "rgba(0,0,0,0)";
		} else {
			ctx.strokeStyle = "#52666e";
			ctx.lineJoin = "round";
			ctx.lineWidth = 2;
		}
	}
};
