"use strict";

gs.samples.selected.cropEnd = gs.samples.selected.duration;

gs.samples.selected.cropStart = function( sample, secRel ) {
	secRel = -gs.samples.selected.duration( sample, -secRel );
	if ( secRel ) {
		gs.samples.selected.when( sample, secRel );
		gs.samples.selected.slip( sample, -secRel );
	}
	return secRel;
};
