"use strict";

waFwk.on.sampleDuration = function( smpobj, dur ) {
	lg("dur", dur)
	smpobj.userData.elRoot.style.width = dur * ui.BPMem + "em";
	// ui.sample.waveform( smpobj );
};
