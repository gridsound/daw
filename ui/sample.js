"use strict";

ui.CSS_sampleCreate = function( smp ) {
	var elSample = wisdom.cE( Handlebars.templates.sample( smp.data.gsfile ) )[ 0 ];

	smp.data.elSample = elSample
	smp.data.elSVG = wisdom.qS( elSample, "svg" );
	smp.data.elName = wisdom.qS( elSample, ".name" );
	smp.data.elCropStart = wisdom.qS( elSample, ".crop.start" );
	smp.data.elCropEnd = wisdom.qS( elSample, ".crop.end" );
	wisdom.qSA( elSample, "*" ).forEach( function( el ) {
		el.gsSample = smp;
	} );
}

ui.CSS_sampleTrack = function( smp ) {
	smp.data.track.elColLinesTrack.appendChild( smp.data.elSample );
};

ui.CSS_sampleWhen = function( smp ) {
	wisdom.css( smp.data.elSample, "left", smp.when * ui.BPMem + "em" );
};

ui.CSS_sampleSelect = function( smp ) {
	smp.data.elSample.classList.toggle( "selected", smp.data.selected );
};

ui.CSS_sampleDelete = function( smp ) {
	smp.data.elSample.remove();
};

ui.CSS_sampleDuration = function( smp ) {
	wisdom.css( smp.data.elSample, "width", smp.duration * ui.BPMem + "em" );
	ui.CSS_sampleWaveform( smp );
};

ui.CSS_sampleOffset =
ui.CSS_sampleWaveform = function( smp ) {
	if ( smp.wBuffer ) {
		var off = smp.offset,
			dur = Math.min( smp.duration, smp.bufferDuration - off ),
			durEm = dur * ui.BPMem;

		wisdom.css( smp.data.elSVG, "width", durEm + "em" );
		smp.wBuffer.waveformSVG( smp.data.elSVG, ~~( durEm * 50 ), 50, off, dur );
	}
};
