"use strict";

ui.Track.prototype.initToggle = function() {
	var that = this;

	this.jqToggle =
	$( "<a class='toggle'>" )
		.appendTo( this.jqColNamesTrack )
		.on( "contextmenu", false )
		.mousedown( function( e ) {
			if ( e.button === 0 ) {
				that.toggle();
			} else if ( e.button === 2 ) {
				ui.toggleTracks( that );
			}
		})
	;
	return this;
};

ui.Track.prototype.toggle = function( b ) {
	if ( typeof b !== "boolean" ) {
		b = !this.isOn;
	}
	if ( this.isOn !== b ) {
		this.isOn = b;
		this.grid.nbTracksOn += b ? 1 : -1;
		this.jqToggle.toggleClass( "on", b );
		this.jqColNamesTrack
			.add( this.jqColLinesTrack )
				.toggleClass( "off", !b );
	}
	return this;
};

