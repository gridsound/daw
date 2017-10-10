"use strict";

gs.controls = {
	init() {
		gs.controls.status = "stopped";
		gs.controls.times = {
			main: 0,
			pattern: 0
		};
		gs.controls._grid = "main";
	},
	currentTime( grid, beat ) {
		if ( beat == null ) {
			return gs.controls.times[ grid ];
		}
		gs.controls.times[ grid ] = beat;
		ui.controls.currentTime( grid, beat );
		if ( gs.controls.status === "playing" ) {
			wa.grids.stop();
			wa.grids.play( grid, beat );
		}
	},
	play() {
		if ( gs.controls.status !== "playing" ) {
			gs.controls.status = "playing";
			wa.grids.play( gs.controls._grid, gs.controls.times[ gs.controls._grid ] )
			ui.controls.play();
			gs.controls._loopOn();
		}
	},
	pause() {
		if ( gs.controls.status === "playing" ) {
			gs.controls.status = "paused";
			gs.controls.times[ gs.controls._grid ] = wa.grids.currentTime();
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
			gs.controls.currentTime( gs.controls._grid, 0 );
		}
	},
	focusOn( grid ) {
		var wasPlaying = gs.controls.status === "playing";

		if ( wasPlaying ) {
			gs.controls.times[ gs.controls._grid ] = wa.grids.currentTime();
			wa.grids.stop();
		}
		gs.controls._grid = grid;
		ui.controls.focusOn( grid );
		if ( wasPlaying ) {
			wa.grids.play( grid, gs.controls.times[ grid ] );
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
		ui.controls.currentTime( gs.controls._grid, wa.grids.currentTime() );
		gs.controls._frameId = requestAnimationFrame( gs.controls._loop );
	}
};
