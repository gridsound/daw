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

} )();
