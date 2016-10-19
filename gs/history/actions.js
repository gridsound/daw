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

function select( action ) {
	action.samples.forEach( function( s ) {
		gs.sampleSelect( s, !s.selected );
	} );
}

function insert( action, sign ) {
	if ( sign === -1 ) {
		return d3lete( action, false );
	}
	action.samples.forEach( function( s ) {
		wa.composition.add( [ s.wsample ] );
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

function d3lete( action, sign ) {
	if ( sign === -1 ) {
		insert( action, false );
	} else {
		action.samples.forEach( function( s ) {
			gs.samplesDelete( s );
		} );
	}
}

function move( action, sign ) {
	var sample = action.sample,
		track = action.track * sign;

	gs.samplesWhen( sample, action.when * sign );
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

function crop( action, sign ) {
	var sample = action.sample;

	gs.samplesDuration( sample, action.duration * sign );
	gs.samplesWhen( sample, action.when * sign );
	gs.samplesSlip( sample, -action.offset * sign );
	gs.samplesForEach( sample, function( s ) {
		wa.composition.update( s.wsample, "mv" );
	} );
}

function cropEnd( action, sign ) {
	gs.samplesDuration( action.sample, action.duration * sign );
	gs.samplesForEach( action.sample, function( s ) {
		wa.composition.update( s.wsample, "mv" );
	} );
}

function slip( action, sign ) {
	gs.samplesSlip( action.sample, action.offset * sign );
	gs.samplesForEach( action.sample, function( s ) {
		wa.composition.update( s.wsample, "mv" );
	} );
}

} )();
