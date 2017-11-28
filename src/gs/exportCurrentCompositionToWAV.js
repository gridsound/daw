"use strict";

gs.exportCurrentCompositionToWAV = function() {
	var cmp = gs.currCmp;

	gs.controls.stop();
	gs._blobDL && URL.revokeObjectURL( gs._blobDL );
	wa.render.on();
	wa.grids.play( "main", 0 );
	return wa.ctx.startRendering().then( function( buffer ) {
		wa.render.off();
		return gs._blobDL = URL.createObjectURL( new Blob( [
			gswaEncodeWAV( buffer, { float32: true } ) ] ) );
	} ).catch( console.error.bind( console ) );
};
