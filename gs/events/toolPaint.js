"use strict";

( function() {

ui.tool.paint = {
	mousedown: function( e ) {
		var sample = e.target.gsSample;

		if ( !sample ) {
			gs.samplesUnselect();
		} else {
			croppingStart = e.target.classList.contains( "start" );
			cropping = croppingStart || e.target.classList.contains( "end" );
			if ( cropping ) {
				sample[ croppingStart ? "elCropStart" : "elCropEnd" ].classList.add( "hover" );
			}
			sampleSave = sample;
			ui.cursor( "app", !cropping ? "grabbing" :
				croppingStart ? "w-resize" : "e-resize" );
		}
	},
	mouseup: function() {
		if ( sampleSave ) {
			gs.samplesForEach( sampleSave, function( s ) {
				wa.composition.update( s.wsample, "mv" );
			} );
			if ( cropping ) {
				sampleSave[ croppingStart ? "elCropStart" : "elCropEnd" ].classList.remove( "hover" );
				cropping = croppingStart = false;
			}
			sampleSave = null;
			ui.cursor( "app", null );
		}
	},
	mousemove: function( e, secRel ) {
		if ( sampleSave ) {
			// Changes tracks:
			if ( !cropping ) {
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
			return cropping
				? croppingStart
					? gs.samplesCropStart( sampleSave, secRel )
					: gs.samplesCropEnd( sampleSave, secRel )
				: gs.samplesWhen( sampleSave, secRel );
		}
	}
};

var sampleSave,
	cropping,
	croppingStart;

} )();
