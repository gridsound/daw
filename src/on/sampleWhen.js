"use strict";

waFwk.on.sampleWhen = function( smpobj, when ) {
	lg("when", when)
	smpobj.userData.elRoot.style.left = when * ui.BPMem + "em";
};
