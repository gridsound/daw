"use strict";

gs.loadNewComposition = function() {
	var i = 0, trks = {},
		patId = common.uuid(),
		keysId = common.uuid();

	for ( ; i < env.def_nbTracks; ++i ) {
		trks[ common.smallId() ] = { order: i, toggle: true, name: "" };
	}
	gs.loadComposition( {
		id: common.uuid(),
		bpm: env.def_bpm,
		stepsPerBeat: env.def_stepsPerBeat,
		beatsPerMeasure: env.def_beatsPerMeasure,
		name: "",
		duration: 0,
		patterns: {
			[ patId ]: {
				name: "pat",
				type: "keys",
				keys: keysId,
				duration: env.def_beatsPerMeasure
			}
		},
		tracks: trks,
		blocks: {},
		keys: {
			[ keysId ]: {}
		}
	} ).then( function() {
		gs.openPattern( patId );
	}, console.log.bind( console ) );
	return false;
};
