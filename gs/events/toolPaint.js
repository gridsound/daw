"use strict";

(function() {

var sampleSave,
	durationCropping;

ui.tool.paint = {
	mousedown: function( e, sample ) {
		durationCropping = e.target.classList.contains( "crop" );
		if ( durationCropping ) {
			ui.jqBody.addClass( "cursor-ewResize" );
			sample.jqCropEnd.addClass( "hover" );
		}
		sampleSave = sample;
	},
	mouseup: function() {
		if ( sampleSave ) {
			gs.samplesForEach( sampleSave, function( s ) {
				wa.composition.update( s.wsample, "mv" );
			});
			if ( durationCropping ) {
				durationCropping = false;
				sampleSave.jqCropEnd.removeClass( "hover" );
				ui.jqBody.removeClass( "cursor-ewResize" );
			}
			sampleSave = null;
		}
	},
	mousemove: function( e, sample, mx, my ) {
		if ( sampleSave ) {
			if ( durationCropping ) {
				gs.samplesDuration( sampleSave, mx / ui.gridEm );
			} else {
				gs.samplesMoveX( sampleSave, mx / ui.gridEm );
				
				// Changes tracks:
				e = e.target;
				var nbTracksToMove, minTrackId = Infinity,
					track = e.uitrack || e.gsSample && e.gsSample.track;
				if ( track ) {
					if ( sampleSave.selected ) {
						nbTracksToMove = track.id - sampleSave.track.id;
						if ( nbTracksToMove < 0 ) {
							gs.selectedSamples.forEach( function( s ) {
								minTrackId = Math.min( s.track.id, minTrackId );
							});
							nbTracksToMove = -Math.min( minTrackId, -nbTracksToMove );
						}
						gs.selectedSamples.forEach( function( s ) {
							s.inTrack( s.track.id + nbTracksToMove );
						});
					} else {
						sampleSave.inTrack( track.id );
					}
				}
			}
		}
	}
};

})();
