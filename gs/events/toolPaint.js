"use strict";

( function() {

ui.tool.paint = {
	mousedown: function( e ) {
		var sample = e.target.gsSample;

		if ( !sample && gs.selectedSamples.length ) {
			pushAction( null, gs.selectedSamples.slice() );
			gs.samplesUnselect();
		} else if ( sample ) {
			oldData.push(
				sample.wsample.when,
				sample.wsample.offset,
				sample.wsample.duration,
				sample.track.id
			);
			croppingStart = e.target.classList.contains( "start" );
			cropping = croppingStart || e.target.classList.contains( "end" );
			if ( cropping ) {
				action = croppingStart ? gs.history.crop : gs.history.endCrop;
				undo = croppingStart ? gs.history.undoCrop : gs.history.undoEndCrop;
				name = croppingStart ? "crop" : "endCrop";
				sample[ croppingStart ? "elCropStart" : "elCropEnd" ].classList.add( "hover" );
			} else {
				action = gs.history.moveX;
				undo = gs.history.undoMoveX;
				name = "move"
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
			if ( sampleSave.xem !== oldData[ 0 ] || sampleSave.wsample.offset !== oldData[ 1 ] ||
				 sampleSave.wsample.duration !== oldData[ 2 ] || sampleSave.track.id !== oldData[ 3 ]
			) {
				gs.history.push( name, {
						func: action,
						sample: sampleSave,
						whenDiff: sampleSave.wsample.when - oldData[ 0 ],
						offset: sampleSave.wsample.offset - oldData[ 1 ],
						durationDiff: oldData[ 2 ] - sampleSave.wsample.duration,
						trackId: sampleSave.track.id,
						changeTrack: sampleSave.track.id !== oldData[ 3 ]
					}, {
						func: undo,
						sample: sampleSave,
						whenDiff: oldData[ 0 ] - sampleSave.wsample.when,
						offset: oldData[ 1 ] - sampleSave.wsample.offset,
						durationDiff: sampleSave.wsample.duration - oldData[ 2 ],
						trackId: oldData[ 3 ],
						changeTrack: sampleSave.track.id !== oldData[ 3 ]
				} );
				action =
				undo = null;
				name = "";
				oldData = [];
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
	croppingStart,
	action,
	undo,
	name,
	oldData = [];

} )();
