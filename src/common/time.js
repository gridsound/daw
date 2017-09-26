"use strict";

common.time = {
	// beats:
	beatToBeat( beat ) {
		return "" + ~~( beat + 1 );
	},
	beatToStep( beat, stepsPerBeat ) {
		beat = ~~( beat % 1 * stepsPerBeat + 1 );
		return ( beat < 10 ? "0" : "" ) + beat;
	},
	beatToMStep( beat, stepsPerBeat ) {
		return common.time._getMil( beat % 1 * stepsPerBeat );
	},

	// seconds:
	secToMin( sec ) {
		return "" + ~~( sec / 60 );
	},
	secToSec( sec ) {
		sec = ~~( sec % 60 );
		return ( sec < 10 ? "0" : "" ) + sec;
	},
	secToMs( sec ) {
		return common.time._getMil( sec );
	},

	// private:
	_getMil( val ) {
		val = ~~( val * 1000 % 1000 );
		return ( val < 10 ? "00" : val < 100 ? "0" : "" ) + val;
	}
};
