"use strict";

gs.loadNewComposition = function() {
	var i = 0, trks = {};

	for ( ; i < settings.def_nbTracks; ++i ) {
		trks[ common.uuid() ] = { order: i, toggle: true, name: "" };
	}
	return gs.loadComposition( {
		id: common.uuid(),
		bpm: settings.def_bpm,
		stepsPerBeat: settings.def_stepsPerBeat,
		beatsPerMeasure: settings.def_beatsPerMeasure,
		name: "",
		duration: 0,
		tracks: trks,
		patterns: {},
		keys: {}
	} ).then(
		function() {
			ui.patterns.open( gs.newPattern( false ) );
		},
		function() {
			console.log( arguments );
		} );
};
