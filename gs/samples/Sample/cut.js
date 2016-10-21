"use strict";

gs.sample.cut = function( smp, newDuration ) {
	if ( newDuration < smp.duration ) {
		var smp2 = gs.sample.create( smp.data.gsfile );

		gs.sample.inTrack( smp2, smp.data.track.id );
		gs.sample.when( smp2, smp.when + newDuration );
		gs.sample.slip( smp2, smp.offset + newDuration );
		gs.sample.duration( smp2, smp.duration - newDuration );
		gs.sample.duration( smp, newDuration );
		wa.composition.update( smp, "mv" );
		wa.composition.update( smp2, "ad" );
	}
};
