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
	action.samples.forEach( function( smp ) {
		gs.sample.select( smp );
	} );
}

function insert( action, sign ) {
	if ( sign === -1 ) {
		return d3lete( action, +1 );
	}
	action.samples.forEach( function( smp ) {
		wa.composition.add( smp );
		ui.CSS_sampleCreate( smp );
		gs.sample.inTrack( smp, smp.data.oldTrack.id );
		gs.sample.when( smp, smp.when );
		gs.sample.duration( smp, smp.duration );
		gs.sample.slip( smp, smp.offset );
		gs.sample.select( smp, smp.data.oldSelected );

		if ( !smp.data.gsfile.nbSamples++ ) {
			ui.CSS_fileUsed( smp.data.gsfile );
		}
	} );
}

function d3lete( action, sign ) {
	if ( sign === -1 ) {
		insert( action, +1 );
	} else {
		action.samples.forEach( gs.sample.delete );
	}
}

function move( action, sign ) {
	var sample = action.sample,
		track = action.track * sign;

	gs.samplesWhen( sample, action.when * sign );
	if ( track ) {
		if ( sample.data.selected ) {
			gs.selectedSamples.forEach( function( smp ) {
				gs.sample.inTrack( smp, smp.data.track.id + track );
			} );
		} else {
			gs.sample.inTrack( sample, sample.data.track.id + track );
		}
	}
	gs.samples.selected.do( sample, function( smp ) {
		wa.composition.update( smp, "mv" );
	} );
}

function crop( action, sign ) {
	var sample = action.sample;

	gs.samplesDuration( sample, action.duration * sign );
	gs.samplesWhen( sample, action.when * sign );
	gs.samplesSlip( sample, -action.offset * sign );
	gs.samples.selected.do( sample, function( smp ) {
		wa.composition.update( smp, "mv" );
	} );
}

function cropEnd( action, sign ) {
	gs.samplesDuration( action.sample, action.duration * sign );
	gs.samples.selected.do( action.sample, function( smp ) {
		wa.composition.update( smp, "mv" );
	} );
}

function slip( action, sign ) {
	gs.samplesSlip( action.sample, action.offset * sign );
	gs.samples.selected.do( action.sample, function( smp ) {
		wa.composition.update( smp, "mv" );
	} );
}

} )();
