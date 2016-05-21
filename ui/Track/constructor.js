"use strict";

ui.Track = function( grid, obj ) {
	obj = obj || {}

	this.grid = grid;
	this.id = ui.tracks.length;
	this.jqColNamesTrack = $( "<div class='track'>" ).appendTo( ui.jqTrackNames );
	this.jqColLinesTrack = $( "<div class='track'>" ).appendTo( ui.jqTrackLines );

	this.jqColNamesTrack[ 0 ].uitrack
	this.jqColLinesTrack[ 0 ].uitrack = this;

	this.wfilters = wa.wctx.createFilters();

	this.initToggle()
		.initEditName()
		.toggle( obj.toggle !== false )
		.editName( obj.name || "" );
};
