"use strict";

ui.sample = {
	create: function( smp ) {
		var elSample = wisdom.cE( Handlebars.templates.sample( smp.data.gsfile ) )[ 0 ];

		smp.data.elSample = elSample
		smp.data.elSVG = wisdom.qS( elSample, "svg" );
		smp.data.elName = wisdom.qS( elSample, ".name" );
		smp.data.elCropStart = wisdom.qS( elSample, ".crop.start" );
		smp.data.elCropEnd = wisdom.qS( elSample, ".crop.end" );
		wisdom.qSA( elSample, "*" ).forEach( function( el ) {
			el.gsSample = smp;
		} );
	},
	delete: function( smp ) {
		smp.data.elSample.remove();
	},
	select: function( smp ) {
		smp.data.elSample.classList.toggle( "selected", smp.data.selected );
	},
	inTrack: function( smp ) {
		smp.data.track.elColLinesTrack.appendChild( smp.data.elSample );
	},
	when: function( smp ) {
		wisdom.css( smp.data.elSample, "left", smp.when * ui.BPMem + "em" );
	},
	duration: function( smp ) {
		wisdom.css( smp.data.elSample, "width", smp.duration * ui.BPMem + "em" );
		ui.sample.waveform( smp );
	},
	waveform: function( smp ) {
		if ( smp.wBuffer ) {
			var off = smp.offset,
				dur = Math.min( smp.duration, smp.bufferDuration - off ),
				durEm = dur * ui.BPMem;

			wisdom.css( smp.data.elSVG, "width", durEm + "em" );
			smp.wBuffer.waveformSVG( smp.data.elSVG, ~~( durEm * 50 ), 50, off, dur );
		}
	}
};
