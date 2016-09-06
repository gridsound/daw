"use strict";

( function() {

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
			var secRel = ui.secRel;
			if ( cropping ) {
				secRel = startCropping
					? gs.samplesCropStart( sampleSave, secRel )
					: gs.samplesCropEnd( sampleSave, secRel );
			} else {
				gs.samplesWhen( sampleSave, secRel );

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

var sampleSave,
	cropping,
	startCropping,
	endCropping;

} )();
