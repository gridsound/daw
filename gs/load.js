"use strict";

( function() {

gs.load = function( saveFile ) {
	return new Promise( function( resolve, reject ) {
		if ( !saveFile ) {
			resolve();
		} else {
			var reader = new FileReader();

			reader.onload = onload.bind( null, resolve );
			reader.readAsText( saveFile );
		}
	} );
};

function onload( resolve, e ) {
	var save = JSON.parse( e.target.result );

	gs.bpm( save.bpm );
	save.files.forEach( gs.fileCreate );
	save.tracks.forEach( function( t ) {
		var id = t[ 0 ];

		while ( id >= ui.tracks.length ) {
			ui.newTrack();
		}
		ui.tracks[ id ].toggle( t[ 1 ] ).editName( t[ 2 ] );
	} );
	save.samples.forEach( function( s ) {
		//          0        1      2      3        4
		// s = [ trackId, fileId, when, offset, duration ]
		var smp = gs.sample.create( gs.files[ s[ 1 ] ] );

		smp.data.gsfile.samplesToSet.push( smp );
		gs.sample.inTrack( smp, s[ 0 ] );
		gs.sample.when( smp, s[ 2 ] / ui.BPMem );
		gs.sample.slip( smp, s[ 3 ] / ui.BPMem );
		gs.sample.duration( smp, s[ 4 ] / ui.BPMem );
		wa.composition.update( smp, "ad" );
	} );
	resolve();
}

} )();
