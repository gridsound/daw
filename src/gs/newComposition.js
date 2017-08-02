"use strict";

gs.newComposition = function() {
	var i = 0,
		trks = {},
		patId = common.uuid(),
		keysId = common.uuid();

	for ( ; i < settings.def_nbTracks; ++i ) {
		trks[ common.uuid() ] = { order: i, toggle: true, name: "" };
	}
	return {
		id: common.uuid(),
		bpm: settings.def_bpm,
		stepsPerBeat: settings.def_stepsPerBeat,
		beatsPerMeasure: settings.def_beatsPerMeasure,
		name: "",
		duration: 0,
		tracks: trks,
		patternOpened: patId,
		patterns: {
			[ patId ]: { name: "pat 1", type: "keys", keys: keysId, duration: 0 }
		},
		keys: {
			[ keysId ]: {}
		},
		blocks: {}
	};
};
