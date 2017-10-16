"use strict";

gs.exportCurrentCompositionToWAV = function() {
	var cmp = gs.currCmp;

	gs._blobDL && URL.revokeObjectURL( gs._blobDL );
	wa.toggleRender( true );
	wa.grids.play( "main", 0 );
	return wa.ctx.startRendering().then( function( buffer ) {
		wa.toggleRender( false );
		return gs._blobDL = URL.createObjectURL( new Blob( [ gswaEncodeWAV( buffer ) ] ) );
	} ).catch( console.error.bind( console ) );
};
