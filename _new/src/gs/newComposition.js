"use strict";

gs.newComposition = function() {
	var cmp = {
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

	ui.cmpPreload( cmp );
	return gs.loadComposition( cmp );
};
