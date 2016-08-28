"use strict";

ui.CSS_sampleCreate = function( s ) {
	s.elSample = wisdom.cE( Handlebars.templates.sample( s.gsfile ) )[ 0 ];
	s.elSVG = wisdom.qS( s.elSample, "svg" );
	s.elName = wisdom.qS( s.elSample, ".name" );
	s.elCropStart = wisdom.qS( s.elSample, ".crop.start" );
	s.elCropEnd = wisdom.qS( s.elSample, ".crop.end" );

	wisdom.qSA( s.elSample, "*" ).forEach( function( el ) {
		el.gsSample = s;
	}, s );
}

ui.CSS_sampleDelete = function( s ) {
	s.elSample.remove();
};

ui.CSS_sampleTrack = function( s ) {
	s.track.elColLinesTrack.appendChild( s.elSample );
};

ui.CSS_sampleWhen = function( s ) {
	wisdom.css( s.elSample, "left", s.wsample.when * ui.BPMem + "em" );
};

ui.CSS_sampleSelect = function( s ) {
	s.elSample.classList.toggle( "selected", s.selected );
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
