"use strict";

gs.newComposition = function() {
	var i = 0, trks = {};

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
		patterns: {},
		keys: {}
	};
};
