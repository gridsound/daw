"use strict";

gs.File.prototype.joinFile = function( file ) {
	this.file = file;

	ui.CSS_fileToLoad( this );
	if ( this.fullname !== file.name ) {
		this.fullname = file.name;
		this.name = this.fullname.replace( /\.[^.]+$/, "" );
		this.jqName.text( this.name );
	}

	if ( this.samplesToSet.length ) {
		var that = this;
		this.load( function() {
			that.samplesToSet.forEach( function( s ) {
				s.wsample = that.wbuff.createSample();
				wa.composition.addSamples( [ s.wsample ] );

				s.canvas = s.jqWaveform[ 0 ];
				s.canvasCtx = s.canvas.getContext( "2d" );
				s.jqName.text( that.name );

				s.wsample.duration = s.savedDuration;
				s.wsample.offset = s.savedOffset;
				s.wsample.when = s.savedWhen;

				ui.CSS_sampleDuration( s );
				ui.CSS_sampleWaveform( s );

				s.wsample.connect( s.track.wfilters );
			} );
		} );
	}
}
