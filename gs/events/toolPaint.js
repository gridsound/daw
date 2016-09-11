"use strict";

( function() {

ui.tool.paint = {
	mousedown: function( e ) {
		var sample = e.target.gsSample;

		if ( !sample ) {
			if ( gs.selectedSamples.length ) {
				var unselected = gs.selectedSamples.slice();
				gs.history.push( {
					action: {
						func: gs.history.select,
						samples: null,
						removedSamples: unselected
					},
					undo: {
						func: gs.history.undoSelect,
						samples: unselected,
						removedSamples: null
					}
				} );
				gs.samplesUnselect();
			}
		} else {
			oldData.push(
				sample.wsample.when,
				sample.wsample.offset,
				sample.wsample.duration,
				sample.track.id
			);
			startCropping = e.target.classList.contains( "start" );
			endCropping = e.target.classList.contains( "end" );
			cropping = startCropping || endCropping;
			if ( cropping ) {
				action = startCropping ? gs.history.crop : gs.history.endCrop;
				undo = startCropping ? gs.history.undoCrop : gs.history.undoEndCrop;
				sample[ startCropping ? "elCropStart" : "elCropEnd" ].classList.add( "hover" );
			} else {
				action = gs.history.moveX;
				undo = gs.history.undoMoveX;
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
			if ( sampleSave.xem != oldData[ 0 ] || sampleSave.wsample.offset != oldData[ 1 ] ||
				 sampleSave.wsample.duration != oldData[ 2 ] || sampleSave.track.id != oldData[ 3 ] ) {
				gs.history.push( {
					action: {
						func: action,
						sample: sampleSave,
						whenDiff: sampleSave.wsample.when - oldData[ 0 ],
						offset: sampleSave.wsample.offset - oldData[ 1 ],
						durationDiff: oldData[ 2 ] - sampleSave.wsample.duration,
						trackId: sampleSave.track.id,
						changeTrack : sampleSave.track.id != oldData[ 3 ]
					},
					undo: {
						func: undo,
						sample: sampleSave,
						whenDiff: oldData[ 0 ] - sampleSave.wsample.when,
						offset: oldData[ 1 ] - sampleSave.wsample.offset,
						durationDiff: sampleSave.wsample.duration - oldData[ 2 ],
						trackId: oldData[ 3 ],
						changeTrack : sampleSave.track.id != oldData[ 3 ]
					}
				} );
				action =
				undo = null;
				oldData = [];
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
	endCropping,
	action,
	undo,
	oldData = [];

} )();
