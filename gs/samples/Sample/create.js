"use strict";

gs.sample.create = function( gsfile, trackId, when ) {
	var elSample = wisdom.cE( Handlebars.templates.sample( gsfile ) )[ 0 ],
		smp = {
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

	if ( gsfile.file ) { // TODO: #emptySample
		smp.wsample = gsfile.wbuff.createSample();
		gs.sample.inTrack( smp, trackId );
		gs.sample.when( smp, when );
		ui.CSS_sampleDuration( smp );
		ui.CSS_sampleWaveform( smp );
		wa.composition.add( smp.wsample );
	}
	gs.sample.select( smp, false );
	return smp;
};
