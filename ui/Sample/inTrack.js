"use strict";

ui.Sample.prototype.inTrack = function( trackId ) {
	var track = ui.tracks[ trackId ];
	if ( track !== this.track ) {
		this.wsample.disconnect();
		this.wsample.connect( track.wfilters );
		this.track = track;
		this.track.jqColLinesTrack.append( this.jqSample );
	}
	return this;
};
