"use strict";

ui.Track = function( grid, obj ) {
	obj = obj || {}

	this.grid = grid;
	this.id = ui.tracks.length; // FIX ME when tracks could be moved or removed
	this.jqColNamesTrack = $( "<div class='track'>" ).appendTo( ui.jqTrackNames );
	this.jqColLinesTrack = $( "<div class='track'>" ).appendTo( ui.jqTrackLines );

	this.jqColNamesTrack[ 0 ].uitrack
	this.jqColLinesTrack[ 0 ].uitrack = this;

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
