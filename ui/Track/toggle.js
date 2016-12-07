"use strict";

ui.Track.prototype.initToggle = function() {
	var that = this;

	this.gsuiToggle = new gsuiToggle(
		this.elColNamesTrack.querySelector( ".gs-ui-toggle" ), {
		onchange: function( b ) {
			that.isOn = b;
			that.wfilters.gain( +b );
			that.elColNamesTrack.classList.toggle( "off", !b );
			that.elColLinesTrack.classList.toggle( "off", !b );
		}
	} );
	if ( ui.tracks.length ) {
		this.gsuiToggle.groupWith( ui.tracks[ 0 ].gsuiToggle );
	}
	return this;
};

ui.Track.prototype.toggle = function( b ) {
	this.gsuiToggle.toggle( b );
	return this;
};

