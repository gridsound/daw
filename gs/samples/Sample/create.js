"use strict";

gs.sample.create = function( gsfile ) {
	var smp = wa.wctx.createSample(),
		elSample = wisdom.cE( Handlebars.templates.sample( gsfile ) )[ 0 ];

	smp.data = {
		selected: false,
		gsfile: gsfile,
		elSample: elSample,
		elSVG: wisdom.qS( elSample, "svg" ),
		elName: wisdom.qS( elSample, ".name" ),
		elCropStart: wisdom.qS( elSample, ".crop.start" ),
		elCropEnd: wisdom.qS( elSample, ".crop.end" ),
	};
	wisdom.qSA( elSample, "*" ).forEach( function( el ) {
		el.gsSample = smp;
	} );
	if ( gsfile.file ) {
		smp.setBuffer( gsfile.wbuff );
	} else {
		smp.setBufferDuration( gsfile.bufferDuration );
	}
	wa.composition.add( smp );
	++gsfile.nbSamples;
	ui.CSS_fileUsed( gsfile );
	ui.CSS_sampleDuration( smp );
	ui.sample.select( smp );
	return smp;
};
