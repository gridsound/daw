"use strict";

gs.loadCompositionByURL = url => fetch( url )
	.then( res => {
		if ( !res.ok ) {
			throw "The file is not accessible: " + url;
		}
		return res.json();
	} )
	.then( gs.loadComposition, e => { throw e; } );
