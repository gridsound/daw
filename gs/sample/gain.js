"use strict";

gs.sample.gain = function( smp, gainValue ) {	

	smp.connectedTo.gain.value += gainValue;

	if (smp.connectedTo.gain.value < 0) {
		smp.connectedTo.gain.value = 0;
	}

	ui.sample.waveform( smp );
	
};
