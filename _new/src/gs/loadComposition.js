"use strict";

gs.loadComposition = function( cmp ) {
	return gs.saveCurrentComposition().then( function() {
		var i, id, tracks = new Array( cmp.nbTracks );

		gs.unloadComposition();
		gs.currCmp = cmp;
		for ( id in cmp.tracks ) {
			tracks[ cmp.tracks[ id ].order ] = true;
		}
		id = i = 0;
		for ( ; i < cmp.nbTracks; ++i ) {
			if ( !tracks[ i ] ) {
				for ( ; cmp.tracks[ id ]; ++id ) {}
				cmp.tracks[ id ] = { order: i, name: "", toggle: true };
			}
		}
		ui.loadComposition( cmp );
	} );
};

// An issue could appear, if nbTracks < max(cmp.tracks[ ... ])
