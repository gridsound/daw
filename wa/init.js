"use strict";

window.wa = {};

wa.wctx = new walContext();
wa.ctx = wa.wctx.ctx;
wa.analyser = wa.wctx.analyser;
wa.analyser.fftSize = 1024;
wa.analyserArray = new Uint8Array( wa.analyser.frequencyBinCount );
