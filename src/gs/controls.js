"use strict";

gs.controls = {
	play() {

	},
	pause() {

	},
	stop() {

	},
	togglePlay( b ) {
		env.togglePlay = b;
		ui.controls.togglePlay( b );
	},
	mainTime( beat ) {
		if ( beat == null ) {
			return gs.controls._tmpMainTime || 0;
		}
		gs.controls._tmpMainTime = beat;
		ui.controls.mainTime( beat );
	},
	patternTime( beat ) {
		if ( beat == null ) {
			return gs.controls._tmpPatternTime || 0;
		}
		gs.controls._tmpPatternTime = beat;
		ui.controls.patternTime( beat );
	},

	// private:
	_loop() {

	}
};
