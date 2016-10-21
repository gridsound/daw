"use strict";

gs.sample.select = function( smp, b ) {

	// TODO: #emptySample
	smp.selected = !b ? false : !!smp.wsample;
	ui.CSS_sampleSelect( smp );
};
