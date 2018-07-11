"use strict";

gs.exportCurrentCompositionToWAV = () => {
	gs.controls.stop();
	if ( gs._blobDL ) {
		URL.revokeObjectURL( gs._blobDL );
	}
	wa.render.on();
	wa.mainGrid.start( 0 );
	return wa.ctx.startRendering().then( buffer => {
		wa.mainGrid.scheduler.stop();
		wa.render.off();
		return gs._blobDL = URL.createObjectURL( new Blob( [
			gswaEncodeWAV.encode( buffer, { float32: true } ) ] ) );
	} ).catch( console.error.bind( console ) );
};
