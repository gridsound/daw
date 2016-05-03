"use strict";

ui.samplesSlip = function( sample, mxem ) {
	mxem /= ui.BPMem;
	function slip( s ) {
		s.slip( s.offset + mxem );
	}

	if ( sample.selected ) {
		ui.selectedSamples.forEach( slip );
	} else {
		slip( sample );
	}
};
