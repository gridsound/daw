"use strict";

ui.CSS_sampleTrack = function( s ) {
	s.track.elColLinesTrack.appendChild( s.elSample );
};

ui.CSS_sampleWhen = function( s ) {
	wisdom.css( s.elSample, "left", s.wsample.when * ui.BPMem + "em" );
};

ui.CSS_sampleSelect = function( s ) {
	s.elSample.classList.toggle( "selected", s.selected );
};

ui.CSS_sampleDelete = function( s ) {
	s.elSample.remove();
};

ui.CSS_sampleOffset = function( s ) {
	ui.CSS_sampleWaveform( s );
};

ui.CSS_sampleDuration = function( s ) {
	wisdom.css( s.elSample, "width", s.wsample.duration * ui.BPMem + "em" );
	ui.CSS_sampleWaveform( s );
};

ui.CSS_sampleWaveform = function( s ) {
	var off = s.wsample.offset,
		dur = Math.min( s.wsample.duration, s.wsample.bufferDuration - off ),
		durEm = dur * ui.BPMem;
	wisdom.css( s.elSVG, "width", durEm + "em" );
	s.wsample.wBuffer.waveformSVG( s.elSVG, ~~( durEm * 50 ), 50, off, dur );
};
