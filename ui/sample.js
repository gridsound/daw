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

ui.CSS_sampleWidth = function( s ) {
	s.jqSample.css( "width", s.wbuff.buffer.duration * ui.BPMem + "em" );
};
