"use strict";

ui.track = function( trk, trkAfter ) {
	var that = this;

	this.id = waFwk.tracks.length - 1;
	this.samples = [];
	this.elColNamesTrack = ui.createHTML( Handlebars.templates.track() )[ 0 ];
	this.elColLinesTrack = ui.createHTML( "<div class='track'>" )[ 0 ];
	this.elColNamesTrack.uitrack
	this.elColLinesTrack.uitrack = this;

	ui.dom.tracksNames.appendChild( this.elColNamesTrack );
	ui.dom.gridcontent.appendChild( this.elColLinesTrack );

	this.gsuiToggle = new gsuiToggle(
		this.elColNamesTrack.querySelector( ".gsuiToggle" ), {
		onchange: function( b ) {
			that.isOn = b;
			that.elColNamesTrack.classList.toggle( "off", !b );
			that.elColLinesTrack.classList.toggle( "off", !b );
		}
	} );

	this.gsuiSpanEditable = new gsuiSpanEditable(
		this.elColNamesTrack.querySelector( ".gsuiSpanEditable" ) );
	this.gsuiSpanEditable.onchange = function( val ) {
		waFwk.do( "nameTrack", trk, val );
	};
	this.gsuiSpanEditable.setPlaceholder( "Track " + ( this.id + 1 ) );
	if ( waFwk.tracks.length > 1 ) {
		this.gsuiToggle.groupWith( waFwk.tracks[ 0 ].userData.gsuiToggle );
	}
	this.toggle( true );
};

ui.track.prototype = {
	toggle: function( b ) {
		this.gsuiToggle.toggle( b );
	},
	name: function( name ) {
		this.gsuiSpanEditable.setValue( name );
	},
	removeSample: function( smp ) {
		var ind = this.samples.indexOf( smp );

		ind > -1 && this.samples.splice( ind, 1 );
	}
};
