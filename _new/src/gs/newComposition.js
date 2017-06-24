"use strict";

gs.newComposition = function() {
	var cmp = {
			id: common.uuid(),
			bpm: settings.defaultBpm,
			name: "",
			duration: 0,
			nbTracks: 42,
			tracks: {},
			data: {},
			blocks: {}
		};

	ui.newComposition( cmp );
	return gs.loadComposition( cmp );
};
