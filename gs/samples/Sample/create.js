"use strict";

gs.sample.create = function( gsfile ) {
	var smp = wa.wctx.createSample(),
		elSample = wisdom.cE( Handlebars.templates.sample( gsfile ) )[ 0 ];

	smp.data = {
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
	gs.sample.select( smp, false );
	++gsfile.nbSamples;
	ui.CSS_fileUsed( gsfile );
	ui.CSS_sampleDuration( smp );
	return smp;
};
