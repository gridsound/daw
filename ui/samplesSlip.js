"use strict";

ui.samplesSlip = function( sample, mxem ) {
	mxem /= ui.BPMem;
	ui.samplesForEach( sample, function( s ) {
		s.slip( s.offset + mxem );
	});
};
