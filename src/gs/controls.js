"use strict";

gs.controls = {
	play() {

	},
	pause() {

	},
	stop() {

	},
	currentTime( s ) {
		if ( s == null ) {
			return 0;
		}
	},
	togglePlay( b ) {
		env.togglePlay = b;
		ui.controls.togglePlay( b );
	},

	// private:
	_loop() {

	}
};
