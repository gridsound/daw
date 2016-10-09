"use strict";

( function() {

Object.assign( gs.history, {
	select:  select,
	insert:  insert,
	delete:  d3lete,
	move:    move,
	crop:    crop,
	cropEnd: cropEnd,
	slip:    slip,
} );

function select( action, undo ) {
	action.samples.forEach( function( s ) {
		gs.sampleSelect( s, !s.selected );
	} );
}

function insert( action, undo ) {
	if ( undo ) {
		return d3lete( action, false );
	}
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

function d3lete( action, undo ) {
	if ( undo ) {
		return insert( action, false );
	}
	action.samples.forEach( function( s ) {
		gs.samplesDelete( s );
	} );
}

function move( action, undo ) {
	var sign   = undo ? -1 : 1,
		sample = action.sample,
		track  = sign * action.track,
		when   = sign * action.when;

	gs.samplesWhen( sample, when );
	if ( track ) {
		if ( sample.selected ) {
			gs.selectedSamples.forEach( function( s ) {
				s.inTrack( s.track.id + track );
			} );
		} else {
			sample.inTrack( sample.track.id + track );
		}
	}
	gs.samplesForEach( sample, function( s ) {
		wa.composition.update( s.wsample, "mv" );
	} );
}

function crop( action, undo ) {
	var sign     = undo ? -1 : 1,
		sample   = action.sample,
		when     = sign * action.when,
		offset   = sign * action.offset,
		duration = sign * action.duration;

	gs.samplesDuration( sample, duration );
	gs.samplesWhen( sample, when );
	gs.samplesSlip( sample, -offset );
	gs.samplesForEach( sample, function( s ) {
		wa.composition.update( s.wsample, "mv" );
	} );
}

function cropEnd( action, undo ) {
	var sign = undo ? -1 : 1,
		duration = sign * action.duration;

	gs.samplesDuration( action.sample, duration );
	gs.samplesForEach( action.sample, function( s ) {
		wa.composition.update( s.wsample, "mv" );
	} );
}

function slip( action, undo ) {
	var sign = undo ? -1 : 1,
		offset = sign * action.offset;

	gs.samplesSlip( action.sample, offset );
	gs.samplesForEach( action.sample, function( s ) {
		wa.composition.update( s.wsample, "mv" );
	} );
}

} )();
