"use strict";

(function() {

var
	wsample,
	jqCursor = $( "<div class='cursor'>" ),
	lastSample
;

function getActiveSamples( b, when ) {
	var wsampleArr = [];

	$.each( ui.samples, function() {
		if ( !when || this.wsample.when + this.wsample.duration > when ) {
			wsampleArr.push( this.wsample );
		}
	});
	return wsampleArr;
}

ui.playComposition = function( when ) {
	if ( !wa.isPlaying ) {
		var	wsampleArr = getActiveSamples( when );

		lastSample = wa.wctx.getLastSample( wsampleArr );
		lastSample.onended( function() {
			wa.startedTime = 0;
			wa.pausedOffset = 0;
			wa.isPlaying = false;
		});
		wa.wctx.loadSamples( wsampleArr );
		wa.startedTime = wa.wctx.ctx.currentTime;
		wa.wctx.playSamples( wsampleArr, when );
		wa.isPlaying = true;
	}
};

ui.stopComposition = function() {
	var wsampleArr = getActiveSamples( wa.wctx.ctx.currentTime );
	wa.wctx.stopSamples( wsampleArr );
	wa.startedTime = 0;
	wa.pausedOffset = 0;
	wa.isPlaying = false;
};

ui.pauseComposition = function() {
	if ( wa.isPlaying ) {
		var wsampleArr = getActiveSamples( wa.pausedOffset );
		wa.pausedOffset += wa.wctx.ctx.currentTime - wa.startedTime;
		lastSample.onended( function() {} );
		wa.wctx.stopSamples( wsampleArr );
		wa.isPlaying = false;
	}
};

ui.playFile = function( uifile ) {
	if ( wsample ) {
		wsample.stop();
	}
	if ( uifile.isLoaded ) {
		jqCursor.css( "transitionDuration", 0 ).css( "left", 0 );
		uifile.jqCanvasWaveform.after( jqCursor );
		wsample = uifile.wbuff.createSample().load().start();
		setTimeout( function() {
			jqCursor.css( "transitionDuration", uifile.wbuff.buffer.duration + "s" )
				.css( "left", "100%" );
		}, 20 );
	}
};

ui.stopFile = function() {
	if ( wsample ) {
		wsample.stop();
		jqCursor.detach();
	}
};

})();
