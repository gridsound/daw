"use strict";

ui.CSS_sampleTrack = function( s ) {
	s.track.elColLinesTrack.appendChild( s.elSample );
};

ui.CSS_sampleWhen = function( s ) {
	ui.css( s.elSample, "left", s.wsample.when * ui.BPMem + "em" );
};

ui.CSS_sampleSelect = function( s ) {
	s.elSample.classList.toggle( "selected", s.selected );
};

ui.CSS_sampleDelete = function( s ) {
	s.elSample.remove();
};

ui.CSS_sampleOffset = function( s ) {
	ui.css( s.elSVG, "marginLeft", -s.wsample.offset * ui.BPMem + "em" );
};

ui.CSS_sampleDuration = function( s ) {
	ui.css( s.elSample, "width", s.wsample.duration * ui.BPMem + "em" );
	ui.css( s.elSVG, "width", s.wsample.bufferDuration * ui.BPMem + "em" );
};

ui.CSS_sampleWaveform = function( s ) {
	s.wsample.wBuffer.waveformSVG( s.elSVG, ~~( s.wsample.bufferDuration * 200 ), 50 );
};
