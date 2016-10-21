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
		wa.composition.add( s.wsample );
		ui.CSS_sampleCreate( s );
		gs.sample.inTrack( s, s.oldTrack.id );
		gs.sample.when( s, s.wsample.when );
		gs.sample.duration( s, s.wsample.duration );
		gs.sample.slip( s, s.wsample.offset );
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
				gs.sample.inTrack( s, s.track.id + track );
			} );
		} else {
			gs.sample.inTrack( sample, sample.track.id + track );
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
