"use strict";

ui.sample = {
	create: function( smp ) {
		var elSmp = wisdom.cE( Handlebars.templates.gridBlockSample( smp.data.gsfile ) )[ 0 ];

		smp.data.elSmp = elSmp;
		smp.data.elWave = elSmp.querySelector( ".gs-ui-waveform" );
		smp.data.elName = elSmp.querySelector( ".name" );
		smp.data.elCropStart = elSmp.querySelector( ".crop.start" );
		smp.data.elCropEnd = elSmp.querySelector( ".crop.end" );
		smp.data.gsuiWaveform = new gsuiWaveform( smp.data.elWave );
		Array.from( elSmp.querySelectorAll( "*" ) ).forEach( function( el ) {
			el.gsSample = smp;
		} );
	},
	delete: function( smp ) {
		smp.data.elSmp.remove();
	},
	select: function( smp ) {
		smp.data.elSmp.classList.toggle( "selected", smp.data.selected );
	},
	inTrack: function( smp ) {
		smp.data.track.elColLinesTrack.appendChild( smp.data.elSmp );
	},
	when: function( smp ) {
		wisdom.css( smp.data.elSmp, "left", smp.when * ui.BPMem + "em" );
	},
	duration: function( smp ) {
		wisdom.css( smp.data.elSmp, "width", smp.duration * ui.BPMem + "em" );
		ui.sample.waveform( smp );
	},
	waveform: function( smp ) {
		if ( smp.wBuffer.buffer ) {
			var off = smp.offset,
				dur = Math.min( smp.duration, smp.bufferDuration - off ),
				durEm = dur * ui.BPMem,
				wave = smp.data.gsuiWaveform;

			smp.data.elWave.style.width = durEm + "em";
			wave.setResolution( ~~( dur * 1024 ), 128 );
			wave.setBuffer( smp.wBuffer.buffer );
			wave.draw( off, dur );
		}
	}
};
