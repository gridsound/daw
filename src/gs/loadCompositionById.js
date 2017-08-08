"use strict";

gs.loadCompositionById = function( cmpId ) {
	var cmp = gs.localStorage.get( cmpId );

	return ( cmp ? gs.loadComposition( cmp ) : gs.loadNewComposition() )
		.then(
			function() {},
			function() { console.log( arguments ); } );
};
