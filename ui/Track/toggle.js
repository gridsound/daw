"use strict";

ui.Track.prototype.initToggle = function() {
	var that = this;

	this.elToggle = wisdom.cE( "<a class='toggle'>" )[ 0 ];
	this.elColNamesTrack.appendChild( this.elToggle );
	this.elToggle.oncontextmenu = function() { return false; };
	this.elToggle.onmousedown = function( e ) {
		if ( e.button === 0 ) {
			that.toggle();
		} else if ( e.button === 2 ) {
			ui.toggleTracks( that );
		}
	};
	return this;
};

ui.Track.prototype.toggle = function( b ) {
	if ( typeof b !== "boolean" ) {
		b = !this.isOn;
	}
	if ( this.isOn !== b ) {
		this.wfilters.gain( +b );
		this.isOn = b;
		this.grid.nbTracksOn += b ? 1 : -1;
		this.elToggle.classList.toggle( "on", b );
		this.elColNamesTrack.classList.toggle( "off", !b );
		this.elColLinesTrack.classList.toggle( "off", !b );
	}
	return this;
};

