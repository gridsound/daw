"use strict";

( function() {

var wctx = new walContext(),
	analyser = wctx.ctx.createAnalyser();

analyser.fftSize = 1024;
wctx.filters.pushBack( analyser );

window.wa = {
	wctx: wctx,
	ctx: wctx.ctx,
	analyser: analyser,
	analyserArray: new Uint8Array( analyser.frequencyBinCount ),
	composition: wctx.createComposition(),
};

} )();
