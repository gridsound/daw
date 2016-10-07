"use strict";

( function() {

Object.assign( gs.history, {
	select:       select,
	select_undo:  select_undo,
	insert:       insert,
	insert_undo:  d3lete,
	delete:       d3lete,
	delete_undo:  insert,
	move:         move,
	move_undo:    move,
	crop:         crop,
	crop_undo:    crop,
	cropEnd:      cropEnd,
	cropEnd_undo: cropEnd,
	slip:         slip,
	slip_undo:    slip,
} );

function select( action ) {
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

function select_undo( action ) {
	var samplesArr = action.samples,
		unselectedArr = action.removedSamples;

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

function insert( action ) {
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
	} );
}

function d3lete( action ) {
	action.samples.forEach( function( s ) {
		gs.samplesDelete( s );
	} );
}

function move( action ) {
	gs.samplesWhen( action.sample, action.when );
	if ( action.track ) {
		if ( action.sample.selected ) {
			gs.selectedSamples.forEach( function( s ) {
				s.inTrack( s.track.id + action.track );
			} );
		} else {
			action.sample.inTrack( action.sample.track.id + action.track );
		}
	}
	gs.samplesForEach( action.sample, function( s ) {
		wa.composition.update( s.wsample, "mv" );
	} );
}

function crop( action ) {
	gs.samplesDuration( action.sample, action.duration );
	gs.samplesWhen( action.sample, action.when );
	gs.samplesSlip( action.sample, -action.offset );
	gs.samplesForEach( action.sample, function( s ) {
		wa.composition.update( s.wsample, "mv" );
	} );
}

function cropEnd( action ) {
	gs.samplesDuration( action.sample, action.duration );
	gs.samplesForEach( action.sample, function( s ) {
		wa.composition.update( s.wsample, "mv" );
	} );
}

function slip( action ) {
	gs.samplesSlip( action.sample, action.offsetDiff );
	gs.samplesForEach( action.sample, function( s ) {
		wa.composition.update( s.wsample, "mv" );
	} );
}

} )();
