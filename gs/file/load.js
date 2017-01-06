"use strict";

gs.file.load = function( that, fn ) {
	that.isLoading = true;
	ui.file.loading( that );
	that.wbuff.setFile( that.file ).then( function( wbuff ) {
		var wave = new gsuiWaveform( that.elFile.querySelector( ".gsuiWaveform" ) ),
			buf = wbuff.buffer,
			bufDur = buf.duration,
			bufData0 = buf.getChannelData( 0 ),
			bufData1 = buf.numberOfChannels < 2 ? bufData0 : buf.getChannelData( 1 );

		that.isLoaded = true;
		that.isLoading = false;
		that.gsuiWaveform = wave;
		wave.setResolution( 250, 40 );
		wave.draw( bufData0, bufData1, bufDur, 0, bufDur );
		ui.file.loaded( that );
		fn( that );
	}, function() {
		that.isLoading = false;
		ui.file.error( that );
		alert( "At this day, the file: \"" + that.fullname +
			"\" can not be decoded by your browser.\n" );
	} );
};
