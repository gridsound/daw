"use strict";

gs.controls = {
	init() {
		gs.controls.status = "stopped";
		gs.controls.times = {
			main: 0,
			pattern: 0
		};
		gs.controls.loopA = {};
		gs.controls.loopB = {};
		gs.controls._grid = "main";
		gs.controls._loopOn();
	},
	currentTime( grid, beat ) {
		if ( beat == null ) {
			return gs.controls.times[ grid ];
		}
		gs.controls.times[ grid ] = beat;
		ui.controls.currentTime( grid, beat );
		wa.grids.replay( beat );
	},
	loop( grid, isLoop, loopA, loopB ) {
		gs.controls.loopA[ grid ] = isLoop ? loopA : null;
		gs.controls.loopB[ grid ] = isLoop ? loopB : null;
		ui.controls.loop( grid, isLoop, loopA, loopB );
		wa.grids.replay();
	},
	play() {
		if ( gs.controls.status !== "playing" ) {
			gs.controls.status = "playing";
			wa.grids.play( gs.controls._grid, gs.controls.times[ gs.controls._grid ] )
			ui.controls.play();
			// gs.controls._loopOn();
		}
	},
	pause() {
		if ( gs.controls.status === "playing" ) {
			gs.controls.status = "paused";
			gs.controls.times[ gs.controls._grid ] = wa.grids.currentTime();
			wa.grids.stop();
			ui.controls.pause();
			// gs.controls._loopOff();
		}
	},
	stop() {
		if ( gs.controls.status === "stopped" ) {
			gs.controls.currentTime( gs.controls._grid, 0 );
		} else {
			gs.controls.status = "stopped";
			wa.grids.stop();
			ui.controls.stop();
			// gs.controls._loopOff();
			gs.controls.currentTime( gs.controls._grid,
				gs.controls.loopA[ gs.controls._grid ] || 0 );
			switch ( document.activeElement ) {
				case ui.mainGridSamples.rootElement: gs.controls.focusOn( "main" ); break;
				case ui.keysGridSamples.rootElement: gs.controls.focusOn( "pattern" ); break;
			}
		}
	},
	focusOn( grid ) {
		if ( grid !== gs.controls._grid && (
			grid === "main" ||
			gs.currCmp.patternOpened )
		) {
			if ( gs.controls.status === "playing" ) {
				gs.controls.times[ gs.controls._grid ] = wa.grids.currentTime();
			}
			gs.controls._grid = grid;
			ui.controls.focusOn( grid );
			ui.controls.clock( gs.controls.currentTime( grid ) );
			wa.grids.replay( gs.controls.times[ grid ] );
		}
	},
	askFocusOn( grid ) {
		if ( gs.controls.status !== "playing" && gs.controls._grid !== grid ) {
			gs.controls.focusOn( grid );
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
		wa.analyser.getByteFrequencyData( wa.analyserData );
		ui.controls.spectrum.draw( wa.analyserData );
		if ( gs.controls.status === "playing" ) {
			ui.controls.currentTime( gs.controls._grid, wa.grids.currentTime() );
		}
		gs.controls._frameId = requestAnimationFrame( gs.controls._loop );
	}
};
