"use strict";

ui.CSS_sampleTrack = function( s ) {
	s.track.jqColLinesTrack.append( s.jqSample );
};

ui.CSS_sampleWhen = function( s ) {
	s.jqSample.css( "left", s.wsample.when * ui.BPMem + "em" );
};

ui.CSS_sampleSelect = function( s ) {
	s.jqSample.toggleClass( "selected", s.selected );
};

ui.CSS_sampleDelete = function( s ) {
	s.jqSample.remove();
};

ui.CSS_sampleOffset = function( s ) {
	s.jqWaveform.css( "marginLeft", -s.wsample.offset * ui.BPMem + "em" );
};

ui.CSS_sampleDuration = function( s ) {
	s.jqSample.css( "width", s.wsample.duration * ui.BPMem + "em" );
	s.jqWaveform.css( "width", s.wsample.bufferDuration * ui.BPMem + "em" );
};

ui.CSS_sampleWaveform = function( s ) {
	var w = s.canvas.width = ~~( s.wsample.bufferDuration * 300 ),
		h = s.canvas.height = 50,
		img = s.canvasCtx.createImageData( w, h );
	s.wsample.wBuffer.drawWaveform( img, [ 0xDD, 0xDD, 0xFF, 0xFF ] );
	s.canvasCtx.putImageData( img, 0, 0 );
};
