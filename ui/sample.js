"use strict";

ui.sample = {
	create: function( smp ) {
		var elSmp = ui.createHTML( Handlebars.templates.gridBlockSample( smp.data.gsfile ) )[ 0 ];

		smp.data.elSmp = elSmp;
		smp.data.elWave = elSmp.querySelector( ".gsuiWaveform" );
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
		smp.data.elSmp.style.left = smp.when * ui.BPMem + "em";
	},
	duration: function( smp ) {
		smp.data.elSmp.style.width = smp.duration * ui.BPMem + "em";
		ui.sample.waveform( smp );
	},
	waveform: function( smp ) {
		var buf = smp.wBuffer.buffer;

		if ( buf ) {
			var off = smp.offset,
				dur = Math.min( smp.duration, buf.duration - off ),
				durEm = dur * ui.BPMem,
				wave = smp.data.gsuiWaveform,
				bufData0 = buf.getChannelData( 0 ),
				bufData1 = buf.numberOfChannels < 2 ? bufData0 : buf.getChannelData( 1 );

			smp.data.elWave.style.width = durEm + "em";
			wave.setResolution( ~~( dur * 1024 ), 128 );
			wave.draw( bufData0, bufData1, buf.duration, off, dur );
		}
	}
};
