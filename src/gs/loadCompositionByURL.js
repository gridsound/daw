"use strict";

gs.loadCompositionByURL = url => fetch( url )
	.then( res => res.json() )
	.then( gs.loadComposition, console.log.bind( console ) );
