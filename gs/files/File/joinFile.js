"use strict";

gs.File.prototype.joinFile = function( file ) {
	var that = this;

	this.file = file;
	this.jqToLoad.removeClass( "fa-question" )
		.addClass( "fa-download" );
	if ( this.fullname !== file.name ) {
		this.fullname = file.name;
		this.name = this.fullname.replace( /\.[^.]+$/, "" );
		this.jqName.text( this.name );
	}

	if ( this.samplesToSet.length ) {
		this.load( function() {
			that.samplesToSet.forEach( function( s ) {
				s.wsample = that.wbuff.createSample();
				wa.composition.addSamples( [ s.wsample ] );

				s.canvas = s.jqWaveform[ 0 ];
				s.canvasCtx = s.canvas.getContext( "2d" );
				s.jqName.appendTo( s.jqSample ).text( that.name );

				s.when( s.savedWhen );
				s.duration( s.savedDuration );
				ui.CSS_sampleWaveform( s );
				s.slip( s.savedOffset );

				s.wsample.connect( s.track.wfilters );
			} );
		} );
	}
}
