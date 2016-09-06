"use strict";

gs.samplesCropEnd = gs.samplesDuration;

gs.samplesCropStart = function( sample, secRel ) {
	secRel = -gs.samplesDuration( sample, -secRel );
	if ( secRel ) {
		gs.samplesWhen( sample, secRel );
		gs.samplesSlip( sample, -secRel );
	}
	return secRel;
};
