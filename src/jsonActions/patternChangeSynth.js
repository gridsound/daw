"use strict";

function json_patternChangeSynth( cmp, pat, synth ) {
	return {
		patterns: {
			[ pat ]: { synth }
		}
	};
}
