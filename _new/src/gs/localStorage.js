"use strict";

gs.localStorage = {
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
		return cmps;
	},
	put( id, cmp ) {
		localStorage[ id ] = JSON.stringify( cmp );
	}
};
