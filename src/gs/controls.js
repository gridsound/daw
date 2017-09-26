"use strict";

gs.controls = {
	init() {
		gs.controls.status = "stopped";
	},
	play() {
		if ( gs.controls.status !== "playing" ) {
			gs.controls.status = "playing";
			if ( env.togglePlay ) {
				wa.grids.main.play();
			} else {
				wa.grids.pattern.play( gs.currCmp.patternOpened );
			}
			ui.controls.play();
			gs.controls._loopOn();
		}
	},
	pause() {
		if ( gs.controls.status === "playing" ) {
			gs.controls.status = "paused";
			wa.grids.main.stop();
			wa.grids.pattern.stop();
			ui.controls.pause();
			gs.controls._loopOff();
		}
	},
	stop() {
		if ( gs.controls.status !== "stopped" ) {
			gs.controls.status = "stopped";
			wa.grids.main.stop();
			wa.grids.pattern.stop();
			ui.controls.stop();
			gs.controls._loopOff();
		}
	},
	togglePlay() {
		ui.controls.togglePlay( env.togglePlay = !env.togglePlay );
		if ( gs.controls.status === "playing" ) {
			wa.grids.main.stop();
			wa.grids.pattern.stop();
			env.togglePlay
				? wa.grids.main.play()
				: wa.grids.pattern.play();
		}
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
	_loopOn() {

	},
	_loopOff() {

	},
	_loop() {

	}
};
