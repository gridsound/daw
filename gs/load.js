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

	save.files.forEach( function( f ) {
		var nf = gs.fileCreate( f );
		nf.samplesToSet = [];
	} );

	save.tracks.forEach( function( t ) {
		var id = t[ 0 ];
		while ( id >= ui.tracks.length ) {
			ui.newTrack();
		}
		ui.tracks[ id ].toggle( t[ 1 ] )
			.editName( t[ 2 ] );
	} );

	save.samples.forEach( function( s ) {
		//        0      1       2      3      4        5
		// s = [ xem, trackId, fileId, when, offset, duration ]

		var ns = gs.sampleCreate( gs.files[ s[ 2 ] ] );
		ns.gsfile.samplesToSet.push( ns );

		ns.xem = s[ 0 ];
		ns.savedWhen = s[ 3 ];
		ns.savedOffset = s[ 4 ];
		ns.savedDuration = s[ 5 ];
		ns.track = ui.tracks[ s[ 1 ] ];
		ns.track.samples.push( ns );

		ui.CSS_sampleTrack( ns );
		wisdom.css( ns.elSample, "left", s[ 3 ] * ui.BPMem + "em" );
		wisdom.css( ns.elSample, "width", s[ 5 ] * ui.BPMem + "em" );
	} );
	resolve();
}

} )();
