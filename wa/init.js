"use strict";

window.wa = {};

wa.wctx = new walContext();
wa.ctx = wa.wctx.ctx;
wa.composition = wa.wctx.createComposition();

setInterval( function() {
	var sec = wa.composition.getOffset();
	ui.setClockTime( sec );
	ui.setCursorTime( sec );
}, 25 );

wa.analyser = wa.ctx.createAnalyser();
wa.analyser.fftSize = 1024;
wa.wctx.filters.pushBack( wa.analyser );
wa.analyserArray = new Uint8Array( wa.analyser.frequencyBinCount );
