"use strict";

waFwk.on.sampleDuration = function( smpobj ) {
	smpobj.userData.elRoot.style.width = smpobj.duration * ui.BPMem + "em";
	// ui.sample.waveform( smpobj );
};
