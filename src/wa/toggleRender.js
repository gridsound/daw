"use strict";

wa.toggleRender = function( b ) {
	if ( b ) {
		var cmp = gs.currCmp;

		wa._savedCtx = wa.ctx;
		wa.ctx = new OfflineAudioContext( 2,
			~~Math.max( cmp.duration / ( cmp.bpm / 60 ) * env.sampleRate, 100 ), env.sampleRate );
	} else {
		wa.ctx = wa._savedCtx;
		delete wa._savedCtx;
	}
};
