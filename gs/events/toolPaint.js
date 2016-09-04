"use strict";

( function() {

var sampleSave,
	cropping,
	startCropping,
	endCropping;

ui.tool.paint = {
	mousedown: function( e ) {
		var sample = e.target.gsSample;

		if ( !sample ) {
			gs.samplesUnselect();
		} else {
			startCropping = e.target.classList.contains( "start" );
			endCropping = e.target.classList.contains( "end" );
			cropping = startCropping || endCropping;
			if ( cropping ) {
				sample[ startCropping ? "elCropStart" : "elCropEnd" ].classList.add( "hover" );
			}
			sampleSave = sample;
			ui.cursor( "app", !cropping ? "grabbing" :
				startCropping ? "w-resize" : "e-resize" );
		}
	},
	mouseup: function() {
		if ( sampleSave ) {
			gs.samplesForEach( sampleSave, function( s ) {
				wa.composition.update( s.wsample, "mv" );
			} );
			if ( cropping ) {
				sampleSave[ startCropping ? "elCropStart" : "elCropEnd" ].classList.remove( "hover" );
				cropping = startCropping = endCropping = false;
			}
			sampleSave = null;
			ui.cursor( "app", null );
		}
	},
	mousemove: function( e ) {
		if ( sampleSave ) {
			var mxem = ui.em_xRel;
			if ( cropping ) {
				if ( endCropping ) {
					gs.samplesDuration( sampleSave, mxem / ui.BPMem );
				} else if ( mxem = -gs.samplesDuration( sampleSave, -mxem / ui.BPMem ) ) {
					gs.samplesMoveX( sampleSave, mxem / ui.BPMem );
					gs.samplesSlip( sampleSave, -mxem );
				}
			} else {
				gs.samplesMoveX( sampleSave, mxem / ui.BPMem );
				
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
							} );
							nbTracksToMove = -Math.min( minTrackId, -nbTracksToMove );
						}
						gs.selectedSamples.forEach( function( s ) {
							s.inTrack( s.track.id + nbTracksToMove );
						} );
					} else {
						sampleSave.inTrack( track.id );
					}
				}
			}
		}
	}
};

} )();
