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
		if ( s.length === 6 ) {
			// FIXME: this `if` has to be removed (it's for maintening the old saved test file)
			s.splice( 0, 1 );
		}

		//          0        1      2      3        4
		// s = [ trackId, fileId, when, offset, duration ]
		var ns = gs.sampleCreate( gs.files[ s[ 1 ] ] );

		ns.gsfile.samplesToSet.push( ns );
		ns.savedWhen = s[ 2 ];
		ns.savedOffset = s[ 3 ];
		ns.savedDuration = s[ 4 ];
		ns.track = ui.tracks[ s[ 0 ] ];
		ns.track.samples.push( ns );
		ui.CSS_sampleTrack( ns );
		wisdom.css( ns.elSample, "left", s[ 2 ] * ui.BPMem + "em" );
		wisdom.css( ns.elSample, "width", s[ 4 ] * ui.BPMem + "em" );
	} );
	resolve();
}

} )();
