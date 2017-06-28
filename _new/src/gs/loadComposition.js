"use strict";

gs.loadComposition = function( cmpId ) {
	return gs.unloadComposition().then( function() {
		var cmp = gs.localStorage.get( cmpId ),
			newOne = !cmp;

		if ( newOne ) {
			cmp = gs.newComposition();
			cmpId = cmp.id;
			ui.cmps.push( cmpId );
			ui.cmps.update( cmpId, cmp );
		}
		gs.currCmp = cmp;
		gs.currCmpSaved = !newOne;
		ui.controls.currentTime( 0 );
		ui.controls.bpm( cmp.bpm );
		ui.mainGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
		ui.keysGridSamples.timeSignature( cmp.beatsPerMeasure, cmp.stepsPerBeat );
		ui.cmps.load( cmpId );
	}, function() {} );
};
