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
		ui.tracks[ id ].toggle( t[ 1 ] ).editName( t[ 2 ] );
	} );

	save.samples.forEach( function( s ) {
		//          0        1      2      3        4
		// s = [ trackId, fileId, when, offset, duration ]
		var ns = gs.sampleCreate( gs.files[ s[ 1 ] ] ),
			whn = s[ 2 ],
			ofs = s[ 3 ],
			dur = s[ 4 ];

		ns.gsfile.samplesToSet.push( ns );
		ns.savedWhen     = whn / ui.BPMem;
		ns.savedOffset   = ofs / ui.BPMem;
		ns.savedDuration = dur / ui.BPMem;
		ns.inTrack( s[ 0 ] );
		wisdom.css( ns.elSample, "left", whn + "em" );
		wisdom.css( ns.elSample, "width", dur + "em" );
	} );
	resolve();
}

} )();
