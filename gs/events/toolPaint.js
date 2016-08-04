"use strict";

( function() {

var sampleSave,
	cropping,
	action,
	undo,
	oldData = [],
	startCropping,
	endCropping;

ui.tool.paint = {
	mousedown: function( e, sample ) {
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
				sample.xem,
				sample.wsample.offset,
				sample.wsample.duration,
				sample.track.id
			);
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
			if ( sampleSave.xem != oldData[ 0 ] || sampleSave.wsample.offset != oldData[ 1 ] ||
				 sampleSave.wsample.duration != oldData[ 2 ] || sampleSave.track.id != oldData[ 3 ] ) {
				gs.history.push( {
					action: {
						func: action,
						sample: sampleSave,
						xemDiff: sampleSave.xem - oldData[ 0 ],
						offset: sampleSave.wsample.offset - oldData[ 1 ],
						durationDiff: ( oldData[ 2 ] - sampleSave.wsample.duration ) * ui.BPMem,
						trackId: sampleSave.track.id,
						changeTrack : sampleSave.track.id != oldData[ 3 ]
					},
					undo: {
						func: undo,
						sample: sampleSave,
						xemDiff: oldData[ 0 ] - sampleSave.xem,
						offset: oldData[ 1 ] - sampleSave.wsample.offset,
						durationDiff: ( sampleSave.wsample.duration - oldData[ 2 ] ) * ui.BPMem,
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
	mousemove: function( e, sample, mx, my ) {
		if ( sampleSave ) {
			mx /= ui.gridEm;
			if ( cropping ) {
				action = startCropping ? gs.history.crop : gs.history.endCrop;
				undo = startCropping ? gs.history.undoCrop : gs.history.undoEndCrop;
				if ( endCropping ) {
					gs.samplesDuration( sampleSave, mx );
				} else if ( mx = -gs.samplesDuration( sampleSave, -mx ) ) {
					gs.samplesMoveX( sampleSave, mx );
					gs.samplesSlip( sampleSave, -mx );
				}
			} else {
				action = gs.history.moveX;
				undo = gs.history.undoMoveX;
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
