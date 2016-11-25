"use strict";

ui.Track.prototype.initToggle = function() {
	var that = this;

	this.elToggle = this.elColNamesTrack.querySelector( ".gs-ui-toggle" );
	gsUIComponents( this.elToggle, {
		onchange: function( b ) {
			that.isOn = b;
			that.wfilters.gain( +b );
			that.elColNamesTrack.classList.toggle( "off", !b );
			that.elColLinesTrack.classList.toggle( "off", !b );
		}
	} );
	if ( ui.tracks.length ) {
		this.elToggle._groupWith( ui.tracks[ 0 ].elToggle );
	}
	return this;
};

ui.Track.prototype.toggle = function( b ) {
	this.elToggle._toggle( b );
	return this;
};

