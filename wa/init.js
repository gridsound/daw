"use strict";

window.wa = {};

wa.wctx = new walContext();
wa.ctx = wa.wctx.ctx;

wa.analyser = wa.ctx.createAnalyser();
wa.analyser.fftSize = 1024;
wa.analyser.connect( wa.ctx.destination );
wa.analyserArray = new Uint8Array( wa.analyser.frequencyBinCount );
