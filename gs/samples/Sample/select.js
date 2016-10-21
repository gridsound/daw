"use strict";

gs.sample.select = function( smp, b ) {
	smp.data.selected = b;
	ui.CSS_sampleSelect( smp );
};
