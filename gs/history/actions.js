"use strict";

( function() {

function insertSample( action ) {
	action.samples.forEach( function( s ) {
		wa.composition.addSamples( [ s.wsample ] );
		gs.samples.push( s );
		ui.CSS_sampleCreate( s );
		s.inTrack( s.oldTrack.id );
		s.when( s.wsample.when );
		s.duration( s.wsample.duration );
		s.slip( s.wsample.offset );
		gs.sampleSelect( s, s.oldSelected );

		if ( !s.gsfile.nbSamples++ ) {
			ui.CSS_fileUsed( s.gsfile );
		}
	});
}

function removeSample( action ) {
	action.samples.forEach( function( s ) {
		gs.samplesDelete( s );
	});
}

function moveSample( action ) {
	var nbTracksToMove, minTrackId = Infinity;

	gs.samplesWhen( action.sample, action.whenDiff );
	if ( action.changeTrack ) {
		if ( action.sample.selected ) {
			nbTracksToMove = action.trackId - action.sample.track.id;
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
			action.sample.inTrack( action.trackId );
		}
	}
	gs.samplesForEach( action.sample, function( s ) {
		wa.composition.update( s.wsample, "mv" );
	} );
}

function cropSample( action ) {
	gs.samplesDuration( action.sample, -action.whenDiff );
	gs.samplesWhen( action.sample, action.whenDiff );
	gs.samplesSlip( action.sample, -action.whenDiff );
	gs.samplesForEach( action.sample, function( s ) {
		wa.composition.update( s.wsample, "mv" );
	} );
}

function endCropSample( action ) {
	gs.samplesDuration( action.sample, -action.durationDiff );
	gs.samplesForEach( action.sample, function( s ) {
		wa.composition.update( s.wsample, "mv" );
	} );
}

gs.history.select = function( action ) {
	var samplesArr = action.samples,
		unselectedArr = action.removedSamples;

	if ( unselectedArr && unselectedArr.length > 0 ) {
		gs.samplesUnselect();
	}
	if ( samplesArr ) {
		samplesArr.forEach( function( s ) {
			gs.sampleSelect( s, !s.selected );
		} );
	}
}

gs.history.undoSelect = function( undo ) {
	var samplesArr = undo.samples,
		unselectedArr = undo.removedSamples;

	if ( samplesArr && samplesArr.length > 0 ) {
		gs.samplesUnselect();
		samplesArr.forEach( function( s ) {
			gs.sampleSelect( s, !s.selected );
		} );
	} else if ( unselectedArr ) {
		unselectedArr.forEach( function( s ) {
			gs.sampleSelect( s, !s.selected );
		} );
	}
}

gs.history.insertSample = function( action ) {
	insertSample( action );
}

gs.history.undoInsertSample = function( undo ) {
	removeSample( undo );
}

gs.history.removeSample = function( action ) {
	removeSample( action );
}

gs.history.undoRemoveSample = function( undo ) {
	insertSample( undo );
}

gs.history.moveX = function( action ) {
	moveSample( action );
}

gs.history.undoMoveX = function( undo ) {
	moveSample( undo );
}

gs.history.crop = function( action ) {
	cropSample( action );
}

gs.history.undoCrop = function( undo ) {
	cropSample( undo );
}

gs.history.endCrop = function( action ) {
	endCropSample( action );
}

gs.history.undoEndCrop = function( undo ) {
	endCropSample( undo );
}

} )();
