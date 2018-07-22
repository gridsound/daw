"use strict";

gs.openSynth = id => {
	const cmp = gs.currCmp,
		synth = cmp.synths[ id ];

	cmp.synthOpened = id;
	ui.synths.select( id );
	ui.synth.open( synth );
	gs.openPattern( ui.synths.getFirstPattern( id ) );
};
