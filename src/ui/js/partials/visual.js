"use strict";

ui.visual = {
	init: function() {
		var osc = new gsuiOscilloscope( ui.dom.visual.querySelector( ".gsuiOscilloscope" ) );

		ui.visual._osc = osc;
		osc.setResolution( 256, ui.dom.visual.clientHeight );
		osc.setPinch( 1 );
		osc.dataFunction( ui.visual._dataFunction );
		osc.drawBegin( ui.visual._drawBegin );
		osc.drawEnd( ui.visual._drawEnd );
	},
	on: function() {
		ui.visual._osc.startAnimation();
	},
	off: function() {
		ui.visual._osc.stopAnimation();
	},

	// private:
	_dataFunction: function() {
		waFwk.analyser.getByteTimeDomainData( waFwk.analyserData );
		return waFwk.analyserData;
	},
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
