"use strict";

gs.controls = {
	init() {
		gs.controls.status = "stopped";
		gs.controls._mainTime =
		gs.controls._patternTime = 0;
	},
	play() {
		if ( gs.controls.status !== "playing" ) {
			gs.controls.status = "playing";
			env.togglePlay
				? wa.grids.playMain( gs.controls._mainTime )
				: wa.grids.playPattern( gs.controls._patternTime, gs.currCmp.patternOpened );
			ui.controls.play();
			gs.controls._loopOn();
		}
	},
	pause() {
		if ( gs.controls.status === "playing" ) {
			gs.controls.status = "paused";
			gs.controls[ env.togglePlay ? "_mainTime" : "_patternTime" ] = wa.grids.currentTime();
			wa.grids.stop();
			ui.controls.pause();
			gs.controls._loopOff();
		}
	},
	stop() {
		if ( gs.controls.status !== "stopped" ) {
			gs.controls.status = "stopped";
			wa.grids.stop();
			ui.controls.stop();
			gs.controls._loopOff();
			( env.togglePlay
				? gs.controls.mainTime
				: gs.controls.patternTime )( 0 );
		}
	},
	togglePlay() {
		var tplay = !env.togglePlay,
			wasPlaying = gs.controls.status === "playing";

		if ( wasPlaying ) {
			gs.controls[ env.togglePlay ? "_mainTime" : "_patternTime" ] = wa.grids.currentTime();
			wa.grids.stop();
		}
		env.togglePlay = tplay;
		if ( wasPlaying ) {
			tplay
				? wa.grids.playMain( gs.controls._mainTime )
				: wa.grids.playPattern( gs.controls._patternTime, gs.currCmp.patternOpened );
		}
		ui.controls.togglePlay( tplay );
	},
	mainTime( beat ) {
		if ( beat == null ) {
			return gs.controls._mainTime;
		}
		gs.controls._mainTime = beat;
		ui.controls.mainTime( beat );
		if ( gs.controls.status === "playing" ) {
			wa.grids.stop();
			wa.grids.playMain( beat );
		}
	},
	patternTime( beat ) {
		if ( beat == null ) {
			return gs.controls._patternTime;
		}
		gs.controls._patternTime = beat;
		ui.controls.patternTime( beat );
		if ( gs.controls.status === "playing" ) {
			wa.grids.stop();
			wa.grids.playPattern( beat, gs.currCmp.patternOpened );
		}
	},

	// private:
	_loopOn() {
		gs.controls._loop();
	},
	_loopOff() {
		cancelAnimationFrame( gs.controls._frameId );
	},
	_loop() {
		var beat = wa.grids.currentTime();

		( env.togglePlay
			? ui.controls.mainTime
			: ui.controls.patternTime )( beat );
		gs.controls._frameId = requestAnimationFrame( gs.controls._loop );
	}
};
