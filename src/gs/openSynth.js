"use strict";

gs.openSynth = function( id ) {
	var cmp = gs.currCmp,
		synth = cmp.synths[ id ];

	cmp.synthOpened = id;
	ui.synth.open( synth );
};
