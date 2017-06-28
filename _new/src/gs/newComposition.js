"use strict";

gs.newComposition = function() {
	return {
		id: common.uuid(),
		bpm: settings.def_bpm,
		stepsPerBeat: settings.def_stepsPerBeat,
		beatsPerMeasure: settings.def_beatsPerMeasure,
		name: "",
		duration: 0,
		nbTracks: 42,
		tracks: {},
		data: {},
		blocks: {}
	};
};
