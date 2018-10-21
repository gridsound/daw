"use strict";

const UIlocalStorage = {
	put( id, cmp ) {
		localStorage[ id ] = JSON.stringify( cmp );
	},
	delete( id ) {
		delete localStorage[ id ];
	},
	get( id ) {
		try {
			const cmp = JSON.parse( localStorage[ id ] );

			return id === cmp.id && cmp.stepsPerBeat ? cmp : null;
		} catch ( e ) {
			return null;
		}
	},
	getAll() {
		const cmps = [];

		for ( let id in localStorage ) {
			const cmp = UIlocalStorage.get( id );

			cmp && cmps.push( cmp );
		}
		cmps.sort( ( a, b ) => a.savedAt < b.savedAt );
		return cmps;
	}
};
