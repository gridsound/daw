"use strict";

gs.namePattern = function( name ) {
	var pats = gs.currCmp.patterns,
		names = Object.keys( pats ).map( function( id ) {
			return pats[ id ].name;
		} );

	return common.nameUnique( name, names );
};
