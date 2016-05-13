"use strict";

(function() {

var sampleSave;

ui.tool.paint = {
	mousedown: function( e, sample ) {
		sampleSave = sample;
	},
	mouseup: function() {
		if ( sampleSave ) {
			ui.samplesForEach( sampleSave, function( s ) {
				wa.composition.update( s.wsample, "mv" );
			});
			sampleSave = null;
		}
	},
	mousemove: function( e, sample, mx, my ) {
		if ( sampleSave ) {
			ui.samplesMoveX( sampleSave, mx / ui.gridEm );
			
			// Changes tracks:
			e = e.target;
			var nbTracksToMove, minTrackId = Infinity,
				track = e.uitrack || e.uisample && e.uisample.track;
			if ( track ) {
				if ( sampleSave.selected ) {
					nbTracksToMove = track.id - sampleSave.track.id;
					if ( nbTracksToMove < 0 ) {
						ui.selectedSamples.forEach( function( s ) {
							minTrackId = Math.min( s.track.id, minTrackId );
						});
						nbTracksToMove = -Math.min( minTrackId, -nbTracksToMove );
					}
					ui.selectedSamples.forEach( function( s ) {
						s.inTrack( s.track.id + nbTracksToMove );
					});
				} else {
					sampleSave.inTrack( track.id );
				}
			}
		}
	}
};

})();
