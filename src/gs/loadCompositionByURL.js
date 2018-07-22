"use strict";

gs.loadCompositionByURL = function( url ) {
	return fetch( url )
		.then( res => res.json() )
		.then( gs.loadComposition,
			console.log.bind( console ) );
};
