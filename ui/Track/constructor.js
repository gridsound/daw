"use strict";

ui.Track = function( grid, obj ) {
	obj = obj || {}

	this.grid = grid;
	this.id = ui.tracks.length; // FIXME: when tracks could be moved or removed
	this.elColNamesTrack = ui.createHTML( Handlebars.templates.track() )[ 0 ];
	this.elColLinesTrack = ui.createHTML( "<div class='track'>" )[ 0 ];
	ui.dom.tracksNames.appendChild( this.elColNamesTrack );
	ui.dom.tracksLines.appendChild( this.elColLinesTrack );

	this.elColNamesTrack.uitrack
	this.elColLinesTrack.uitrack = this;

	this.wfilters = wa.wctx.createFilters();
	this.samples = [];

	this.initToggle()
		.initEditName()
		.toggle( obj.toggle !== false )
		.editName( obj.name || "" );
};

ui.Track.prototype = {
	removeSample: function( s ) {
		var index = this.samples.indexOf( s );
		if ( index >= 0 ) {
			this.samples.splice( index, 1 );
		}
	}
}
