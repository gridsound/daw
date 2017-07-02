"use strict";

gs.localStorage = {
	put( id, cmp ) {
		localStorage[ id ] = JSON.stringify( cmp );
	},
	delete( id ) {
		delete localStorage[ id ];
	},
	get( id ) {
		try {
			var cmp = JSON.parse( localStorage[ id ] );

			return id === cmp.id && cmp.stepsPerBeat ? cmp : null;
		} catch ( e ) {
			return null;
		}
	},
	getAll() {
		var id, cmp, cmps = [];

		for ( id in localStorage ) {
			if ( cmp = gs.localStorage.get( id ) ) {
				cmps.push( cmp );
			}
		}
		cmps.sort( function( a, b ) {
			return a.savedAt < b.savedAt;
		} );
		return cmps;
	}
};
