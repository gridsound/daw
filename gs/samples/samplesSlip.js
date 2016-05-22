"use strict";

gs.samplesSlip = function( sample, mxem ) {
	mxem /= ui.BPMem;
	gs.samplesForEach( sample, function( s ) {
		s.slip( s.wsample.offset - mxem );
	});
};
