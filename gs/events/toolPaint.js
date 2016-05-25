"use strict";

(function() {

var sampleSave,
	cropping,
	startCropping,
	endCropping;

ui.tool.paint = {
	mousedown: function( e, sample ) {
		startCropping = e.target.classList.contains( "start" );
		endCropping = e.target.classList.contains( "end" );
		cropping = startCropping || endCropping;
		if ( cropping ) {
			ui.jqBody.addClass( "cursor-ewResize" );
			sample[ startCropping ? "jqCropStart" : "jqCropEnd" ].addClass( "hover" );
		}
		sampleSave = sample;
	},
	mouseup: function() {
		if ( sampleSave ) {
			gs.samplesForEach( sampleSave, function( s ) {
				wa.composition.update( s.wsample, "mv" );
			});
			if ( cropping ) {
				sampleSave[ startCropping ? "jqCropStart" : "jqCropEnd" ].removeClass( "hover" );
				cropping = startCropping = endCropping = false;
				ui.jqBody.removeClass( "cursor-ewResize" );
			}
			sampleSave = null;
		}
	},
	mousemove: function( e, sample, mx, my ) {
		if ( sampleSave ) {
			mx /= ui.gridEm;
			if ( cropping ) {
				if ( startCropping ) {
					gs.samplesMoveX( sampleSave, mx );
					gs.samplesSlip( sampleSave, -mx );
					gs.samplesDuration( sampleSave, -mx );
				} else {
					gs.samplesDuration( sampleSave, mx );
				}
			} else {
				gs.samplesMoveX( sampleSave, mx );
				
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
