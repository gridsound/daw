"use strict";

ui.Sample.prototype.inTrack = function( trackId ) {
	var track = ui.tracks[ trackId ];
	track.jqColLinesTrack.append( this.jqSample );
	return this;
};
