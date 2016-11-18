"use strict";

( function() {

Object.assign( gs.history, {
	select:  select,
	delete:  d3lete,
	move:    move,
	crop:    crop,
	cropEnd: cropEnd,
	slip:    slip,
	paste:   paste,
	cut:     cut,
} );

function paste( data, sign ) {
	if ( sign > 0 ) {
		data.selected.forEach( function( smp ) {
			gs.sample.select( smp, false );
		} );
		data.pasted.forEach( function( smp, i ) {
			var cpy = data.copied[ i ];

			gs.sample.inTrack( smp, cpy.data.track.id );
			gs.sample.when( smp, cpy.when + data.allDuration );
			gs.sample.slip( smp, cpy.offset );
			gs.sample.duration( smp, cpy.duration );
			gs.sample.select( smp, true );
		} );
		wa.composition.add( data.pasted );
	} else {
		data.pasted.forEach( gs.sample.delete );
		data.selected.forEach( function( smp ) {
			gs.sample.select( smp, true );
		} );
	}
}

function cut( data, sign ) {
	var nsmp, dur = data.duration;

	data.samples.forEach( function( smp, i ) {
		nsmp = data.newSamples[ i ];
		if ( sign > 0 ) {
			gs.sample.inTrack( nsmp, smp.data.track.id );
			gs.sample.when( nsmp, smp.when + dur );
			gs.sample.slip( nsmp, smp.offset + dur );
			gs.sample.duration( nsmp, smp.duration - dur );
			gs.sample.duration( smp, dur );
			wa.composition.add( nsmp );
		} else {
			gs.sample.duration( smp, dur + nsmp.duration );
			gs.sample.delete( nsmp );
		}
		wa.composition.update( smp );
	} );
}

function select( data ) {
	data.samples.forEach( function( smp ) {
		gs.sample.select( smp );
	} );
}

function d3lete( data, sign ) {
	if ( sign > 0 ) {
		data.samples.forEach( gs.sample.delete );
	} else {
		data.samples.forEach( function( smp ) {
			gs.sample.inTrack( smp, smp.data.track.id );
			gs.sample.when( smp, smp.when );
			gs.sample.slip( smp, smp.offset );
			gs.sample.duration( smp, smp.duration );
			gs.sample.select( smp, smp.data.oldSelected );
			wa.composition.add( smp );
			if ( !smp.data.gsfile.nbSamples++ ) {
				ui.file.used( smp.data.gsfile );
			}
		} );
	}
}

function move( data, sign ) {
	var sample = data.sample,
		track = data.track * sign;

	gs.samples.selected.when( sample, data.when * sign );
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

function crop( data, sign ) {
	var sample = data.sample;

	gs.samples.selected.duration( sample, data.duration * sign );
	gs.samples.selected.when( sample, data.when * sign );
	gs.samples.selected.slip( sample, -data.offset * sign );
	gs.samples.selected.do( sample, function( smp ) {
		wa.composition.update( smp, "mv" );
	} );
}

function cropEnd( data, sign ) {
	gs.samples.selected.duration( data.sample, data.duration * sign );
	gs.samples.selected.do( data.sample, function( smp ) {
		wa.composition.update( smp, "mv" );
	} );
}

function slip( data, sign ) {
	gs.samples.selected.slip( data.sample, data.offset * sign );
	gs.samples.selected.do( data.sample, function( smp ) {
		wa.composition.update( smp, "mv" );
	} );
}

} )();
