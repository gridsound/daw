"use strict";

jsonActions.patternChangeSynth = function( patId, synthId ) {
	return { patterns: { [ patId ]: {
		synth: synthId
	} } };
};
