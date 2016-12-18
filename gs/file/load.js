"use strict";

gs.file.load = function( that, fn ) {
	that.isLoading = true;
	ui.file.loading( that );
	that.wbuff.setFile( that.file ).then( function( wbuff ) {
		var wave = new gsuiWaveform( that.elFile.querySelector( ".gs-ui-waveform" ) );

		that.isLoaded = true;
		that.isLoading = false;
		that.gsuiWaveform = wave;
		wave.setResolution( 250, 40 );
		wave.setBuffer( wbuff.buffer );
		wave.draw();
		ui.file.loaded( that );
		fn( that );
	}, function() {
		that.isLoading = false;
		ui.file.error( that );
		alert( "At this day, the file: \"" + that.fullname +
			"\" can not be decoded by your browser.\n" );
	} );
};
